import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { ContractsService } from '../contracts';
import { GoodsService } from '../../goods';
import { InvoiceService } from '../invoice';
import { OrdersConfirmationService } from '../orders-confirmation';

import {
  getProductIdsFromOrderProductLines,
  getServiceIdsFromServiceLines,
} from '../../common/utils';

import { Order } from './entities';
import { CreateOrderDTO, UpdateOrderDTO } from './dto';
import { GetOrderResponseDTO } from './dto/respone-dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    @InjectDataSource() private dataSource: DataSource,
    @Inject(forwardRef(() => ContractsService))
    private readonly contractsService: ContractsService,
    @Inject(forwardRef(() => InvoiceService))
    private readonly invoiceService: InvoiceService,
    private readonly goodsService: GoodsService,
    private readonly orderConfirmationsService: OrdersConfirmationService,
  ) {}

  async getOrders(): Promise<Order[]> {
    const orders = await this.ordersRepository
      .createQueryBuilder('order')
      .leftJoin('order.seller', 'seller')
      .leftJoin('order.buyer', 'buyer')
      .leftJoin('order.recipient', 'recipient')
      .leftJoin('order.contract', 'contract')
      .leftJoin('order.orderLines', 'orderLine')
      .leftJoin('orderLine.productMan', 'product')
      .leftJoin('order.orderConfirmations', 'orderConfirmation')
      .select([
        'order.id',
        'order.documentSum',
        'seller.name',
        'buyer.name',
        'recipient.name',
        'contract.name',
        'orderLine.id',
        'product.name',
        'orderConfirmation.id',
        'orderConfirmation.expectedDate',
      ])
      .orderBy('order.id', 'DESC')
      .getMany();

    for (const order of orders) {
      order['orderProducts'] = this.getOrderProductNames(order);
      delete order.orderLines;

      order['confirmDate'] = this.getOrderConfirmationDate(order);
      delete order.orderConfirmations;
    }

    return orders;
  }

  private getOrderProductNames(order: Order): string[] {
    const products: Set<string> = new Set();
    for (const line of order.orderLines) {
      products.add(line.productMan.name);
    }

    return [...products].sort();
  }

  private getOrderConfirmationDate(order: Order): Date {
    if (order.orderConfirmations.length) {
      if (order.orderConfirmations.length > 1) {
        let id = 0;
        let confirmDate: Date;
        for (const confirmation of order.orderConfirmations) {
          if (confirmation.id > id) {
            id = confirmation.id;
            confirmDate = confirmation.expectedDate;
          }
        }
        return confirmDate;
      } else {
        return order.orderConfirmations[0].expectedDate;
      }
    }
  }

  async getOrderById(orderId: number): Promise<GetOrderResponseDTO> {
    const order = await this.ordersRepository
      .createQueryBuilder('order')
      .leftJoinAndMapOne(
        'order.confirmation',
        'order.orderConfirmations',
        'confirmation',
        `confirmation.orderId = order.id AND NOT EXISTS
        (SELECT 1 FROM documents_orderconfirmation oc WHERE
        oc.order_id = order.id AND oc.id > confirmation.id)`,
      )
      .where('order.id = :orderId', { orderId })
      .getOne();

    const invoices = await this.invoiceService.getInvoicesByOrderId(orderId);
    const orderConfirmations =
      await this.orderConfirmationsService.getConfirmationsByOrderId(orderId);

    return { order, invoices, orderConfirmations };
  }

  async getOrdersByContractId(contractId: number): Promise<Order[]> {
    const orders = await this.ordersRepository
      .createQueryBuilder('order')
      .where('order.contractId = :contractId', { contractId })
      .select(['order.id', 'order.status'])
      .orderBy('order.id', 'ASC')
      .getMany();

    for await (const order of orders) {
      order['invoices'] = await this.invoiceService.getInvoicesByOrderId(
        order.id,
      );
    }

    return orders;
  }

  async createOrder(createOrderDTO: CreateOrderDTO): Promise<Order> {
    createOrderDTO['technicalProcesses'] =
      await this.getTechnicalProcesses(createOrderDTO);

    const newOrder = new Order(createOrderDTO);

    newOrder.isHidden = createOrderDTO.isHidden
      ? createOrderDTO.isHidden
      : false;
    newOrder.createdAt = new Date();
    newOrder.signatureDate = newOrder.signatureDate || newOrder.createdAt;
    newOrder.comment = newOrder.comment || '';
    newOrder.transportPlace = newOrder.transportPlace || '';
    newOrder.status = false;
    newOrder.paymentDelay = newOrder.paymentDelay || 0;
    newOrder.vat = newOrder.vat || 0;
    newOrder.orderNumber =
      newOrder.orderNumber ||
      (await this.createNextOrderNumber(
        newOrder.contractId,
        newOrder.sellerId,
      ));

    newOrder.documentSum =
      createOrderDTO.orderLines.reduce(
        (acc, cur) => (acc += cur.price * cur.qty),
        0,
      ) +
      createOrderDTO.orderServiceLines.reduce(
        (acc, cur) => (acc += cur.price * cur.qty),
        0,
      );

    return await this.ordersRepository.save(newOrder);
  }

  private async getTechnicalProcesses(
    createOrderDTO: CreateOrderDTO,
  ): Promise<{ id: number }[]> {
    const productIds = getProductIdsFromOrderProductLines(
      createOrderDTO.orderLines,
    );
    const productProcesses =
      await this.goodsService.getTechnicalProcessesFromProductIds(productIds);

    const serviceIds = getServiceIdsFromServiceLines(
      createOrderDTO.orderServiceLines,
    );
    const serviceProcesses =
      await this.goodsService.getTechnicalProcessesFromServiceIds(serviceIds);

    const technicalProcesses = [
      ...new Set([...productProcesses, ...serviceProcesses]),
    ];

    return technicalProcesses.map((process) => ({ id: process.id }));
  }

  async updateOrder(
    orderId: number,
    updateOrderDTO: UpdateOrderDTO,
  ): Promise<Order> {
    const order = await this.ordersRepository
      .createQueryBuilder('order')
      .where('order.id = :orderId', { orderId })
      .andWhere('order.status = FALSE')
      .leftJoinAndSelect('order.orderLines', 'orderLines')
      .leftJoinAndSelect('order.orderServiceLines', 'orderServiceLines')
      .leftJoinAndSelect('order.technicalProcesses', 'technicalProcesses')
      .getOne();

    const updatedOrderLinesIds = [];
    for (const line of updateOrderDTO.orderLines) {
      if (line['id']) {
        updatedOrderLinesIds.push(line['id']);
      }
    }
    const orderLinesToDelete = order.orderLines.filter(
      (line) => !updatedOrderLinesIds.includes(line.id),
    );

    const updatedOrderServiceLinesIds = [];
    for (const line of updateOrderDTO.orderServiceLines) {
      if (line['id']) {
        updatedOrderServiceLinesIds.push(line['id']);
      }
    }
    const orderServiceLinesToDelete = order.orderServiceLines.filter(
      (line) => !updatedOrderServiceLinesIds.includes(line.id),
    );

    const updated = Object.assign(order, updateOrderDTO);

    // TODO: update technical processes

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (orderLinesToDelete.length) {
        await queryRunner.manager.remove(orderLinesToDelete);
      }

      if (orderServiceLinesToDelete.length) {
        await queryRunner.manager.remove(orderServiceLinesToDelete);
      }

      await queryRunner.manager.save(updated);

      await queryRunner.commitTransaction();

      return updated;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException();
    } finally {
      await queryRunner.release();
    }
  }

  async removeOrder(orderId: number): Promise<Order> {
    try {
      const order = await this.ordersRepository.findOne({
        where: { id: orderId, status: false },
        relations: ['orderLines', 'orderServiceLines'],
      });
      return await this.ordersRepository.remove(order);
    } catch (e) {
      throw new NotFoundException(e);
    }
  }

  async changeOrderStatus(orderId: number): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id: orderId },
    });

    order.status = !order.status;

    return await this.ordersRepository.save(order);
  }

  private async createNextOrderNumber(
    contractId: number,
    sellerId: number,
  ): Promise<string> {
    const orderPrefix =
      (await this.contractsService.getOrderPrefix(contractId)) || '';

    const regexPattern = `^${orderPrefix}[0-9]+$`;

    const orders = await this.ordersRepository
      .createQueryBuilder('order')
      .where('order.sellerId = :sellerId', { sellerId })
      .andWhere('order.orderNumber ~ :regexPattern', {
        regexPattern,
      })
      .select(['order.orderNumber'])
      .getMany();

    let numbers: number[] = [];
    if (orderPrefix) {
      numbers = orders
        .map((order) => +order.orderNumber.split(orderPrefix)[1])
        .filter(
          (item) => typeof item === 'number' && !isNaN(item) && item !== null,
        );
    } else {
      numbers = orders.map((order) => +order.orderNumber);
    }

    return orderPrefix + (Math.max(...numbers) + 1);
  }
}
