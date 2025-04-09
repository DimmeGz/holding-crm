import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { Order } from './entities';
import { CreateOrderDTO, UpdateOrderDTO } from './dto';

import { InvoiceService } from '../invoice/invoice.service';
import { GoodsService } from '../../goods';
import { OrdersConfirmationService } from '../orders-confirmation';
import {
  getProductIdsFromOrderProductLines,
  getServiceIdsFromServiceLines,
} from '../../common/utils';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    @InjectDataSource() private dataSource: DataSource,
    private readonly invoiceService: InvoiceService,
    private readonly goodsService: GoodsService,
    private readonly orderConfirmationsService: OrdersConfirmationService,
  ) {}

  async getOrders() {
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

    for (let order of orders) {
      order = this.getOrderProducts(order);
      order = this.getOrderConfirmationDate(order);
    }

    return orders;
  }

  private getOrderProducts(order: Order) {
    const products = new Set();
    for (const line of order.orderLines) {
      products.add(line.productMan.name);
    }

    delete order.orderLines;
    order['orderProducts'] = [...products].sort();
    return order;
  }

  private getOrderConfirmationDate(order: Order) {
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
        order['confirmDate'] = confirmDate;
      } else {
        order['confirmDate'] = order.orderConfirmations[0].expectedDate;
      }
      delete order.orderConfirmations;
    }

    return order;
  }

  async getOrderById(orderId: number) {
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

  async getOrdersByContractId(contractId: number) {
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

  async createOrder(createOrderDTO: CreateOrderDTO) {
    createOrderDTO['technicalProcesses'] =
      await this.getTechnicalProcesses(createOrderDTO);

    const newOrder = new Order(createOrderDTO);

    newOrder.isHidden = false;
    newOrder.createdAt = new Date();
    newOrder.signatureDate = newOrder.signatureDate || newOrder.createdAt;
    newOrder.comment = newOrder.comment || '';
    newOrder.transportPlace = newOrder.transportPlace || '';
    newOrder.status = false;
    newOrder.paymentDelay = newOrder.paymentDelay || 0;
    newOrder.vat = newOrder.vat || 0;

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

  private async getTechnicalProcesses(createOrderDTO: CreateOrderDTO) {
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

  async updateOrder(orderId: number, updateOrderDTO: UpdateOrderDTO) {
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

  async removeOrder(orderId: number) {
    const order = await this.ordersRepository.findOne({
      where: { id: orderId, status: false },
      relations: ['orderLines', 'orderServiceLines'],
    });
    return await this.ordersRepository.remove(order);
  }

  async changeOrderStatus(orderId: number) {
    const order = await this.ordersRepository.findOne({
      where: { id: orderId },
    });

    order.status = order.status ? false : true;

    return await this.ordersRepository.save(order);
  }
}
