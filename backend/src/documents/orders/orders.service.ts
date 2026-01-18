import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';

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
import { GetOrdersQueryDTO } from './dto/query-dto';
import { CompanyType } from '../../companies/enums';
import { DocumentTypeEnum } from '../common/enums';

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

  private createBaseQueryBuilder(): SelectQueryBuilder<Order> {
    return this.ordersRepository.createQueryBuilder('order');
  }

  private applyOrderListSelect(
    qb: SelectQueryBuilder<Order>,
  ): SelectQueryBuilder<Order> {
    return qb
      .leftJoin('order.contract', 'contract')
      .leftJoin('order.orderLines', 'orderLine')
      .leftJoin('orderLine.productMan', 'product')
      .leftJoin('order.orderConfirmations', 'orderConfirmation')
      .select([
        'order.id',
        'order.sellerId',
        'order.buyerId',
        'order.recipientId',
        'order.documentSum',
        'order.currencyId',
        'order.expectedDate',
        'order.confirmExpectedDate',
        'order.status',
        'order.orderNumber',
        'contract.name',
        'orderLine.id',
        'product.name',
        'orderConfirmation.id',
        'orderConfirmation.expectedDate',
      ]);
  }

  private applyQueryFilter(
    qb: SelectQueryBuilder<Order>,
    query?: GetOrdersQueryDTO,
  ): SelectQueryBuilder<Order> {
    if (!query || Object.keys(query).length === 0) {
      return qb; // Return the query builder unmodified if query is empty
    }

    if (query.status) {
      qb.andWhere('order.status = :orderStatus', { orderStatus: query.status });
    }

    if (query.process) {
      qb.leftJoin('order.technicalProcesses', 'technicalProcess').andWhere(
        'technicalProcess.id = :processId',
        {
          processId: query.process,
        },
      );
    }

    if (query.type) {
      if (query.type === DocumentTypeEnum.SELLER) {
        qb.andWhere('seller.companyType = :companyType', {
          companyType: CompanyType.INNER_COMPANY,
        });
      } else {
        qb.andWhere('buyer.companyType = :companyType', {
          companyType: CompanyType.INNER_COMPANY,
        });
      }
    }

    if (query.year) {
      qb.andWhere('EXTRACT(YEAR FROM order.expectedDate) = :year', {
        year: query.year,
      });
    }

    return qb;
  }

  async getOrders(query?: GetOrdersQueryDTO): Promise<Order[]> {
    const orders = await this.applyQueryFilter(
      this.applyOrderListSelect(this.createBaseQueryBuilder()),
      query,
    )
      .orderBy('order.expectedDate', 'DESC', 'NULLS LAST')
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

  private getOrderConfirmationDate(order: Order): Date | undefined {
    if (!order.orderConfirmations?.length) {
      return undefined;
    }

    return order.orderConfirmations.reduce((latest, current) =>
      current.id > latest.id ? current : latest,
    ).expectedDate;
  }

  async getOrderById(orderId: number): Promise<GetOrderResponseDTO> {
    const order = await this.createBaseQueryBuilder()
      .leftJoinAndMapOne(
        'order.confirmation',
        'order.orderConfirmations',
        'confirmation',
        `confirmation.orderId = order.id AND NOT EXISTS
        (SELECT 1 FROM documents_orderconfirmation oc WHERE
        oc.order_id = order.id AND oc.id > confirmation.id)`,
      )
      .where('order.id = :orderId', { orderId })
      .leftJoin('order.seller', 'seller')
      .leftJoin('order.sellerWarehouse', 'sellerWarehouse')
      .leftJoin('order.buyer', 'buyer')
      .leftJoin('order.buyerWarehouse', 'buyerWarehouse')
      .leftJoin('order.recipient', 'recipient')
      .leftJoin('order.recipientWarehouse', 'recipientWarehouse')
      .leftJoin('order.contract', 'contract')
      .leftJoin('order.currency', 'currency')
      .leftJoin('order.orderLines', 'orderLine')
      .leftJoin('orderLine.productMan', 'productMan')
      .leftJoin('orderLine.productBuy', 'productBuy')
      .leftJoin('orderLine.package', 'package')
      .leftJoin('confirmation.buyerWarehouse', 'confirmBuyerWarehouse')
      .leftJoin('confirmation.recipient', 'confirmRecipient')
      .leftJoin('confirmation.recipientWarehouse', 'confirmRecipientWarehouse')
      .leftJoin('confirmation.orderLines', 'confirmOrderLine')
      .leftJoin('confirmOrderLine.productMan', 'confirmProductMan')
      .leftJoin('confirmOrderLine.productBuy', 'confirmProductBuy')
      .leftJoin('confirmOrderLine.package', 'confirmPackage')
      .select([
        'order.id',
        'order.status',
        'order.orderNumber',
        'order.createdAt',
        'order.expectedDate',
        'order.vat',
        'order.paymentDelay',
        'order.incoterms',
        'currency.name',
        'seller.name',
        'sellerWarehouse.name',
        'buyer.name',
        'buyerWarehouse.name',
        'recipient.name',
        'recipientWarehouse.name',
        'contract.id',
        'contract.name',
        // confirmation
        'confirmation.confirmationNumber',
        'confirmation.createdAt',
        'confirmation.expectedDate',
        'confirmation.paymentDelay',
        'confirmation.incoterms',
        'confirmBuyerWarehouse.name',
        'confirmRecipient.name',
        'confirmRecipientWarehouse.name',
        // lines
        'orderLine.qty',
        'orderLine.price',
        'orderLine.batchRename',
        'productMan.name',
        'productBuy.name',
        'package.name',
        // confirmation lines
        'confirmOrderLine.qty',
        'confirmOrderLine.price',
        'confirmProductMan.name',
        'confirmProductBuy.name',
        'confirmPackage.name',
      ])
      .getOne();

    if (!order) {
      throw new NotFoundException(`Order with id: ${orderId} not found`);
    }

    const invoices = await this.invoiceService.getInvoicesByOrderId(orderId);
    const orderConfirmations =
      await this.orderConfirmationsService.getConfirmationsByOrderId(orderId);

    return { order, invoices, orderConfirmations };
  }

  async getOrdersByContractId(contractId: number): Promise<Order[]> {
    const orders = await this.createBaseQueryBuilder()
      .where('order.contractId = :contractId', { contractId })
      .select(['order.id', 'order.status'])
      .orderBy('order.id', 'ASC')
      .getMany();

    await Promise.all(
      orders.map(async (order) => {
        order['invoices'] = await this.invoiceService.getInvoicesByOrderId(
          order.id,
        );
      }),
    );

    return orders;
  }

  async createOrder(createOrderDTO: CreateOrderDTO): Promise<Order> {
    const newOrder = this.ordersRepository.create(createOrderDTO);

    newOrder.technicalProcesses =
      await this.getTechnicalProcesses(createOrderDTO);
    newOrder.isHidden = createOrderDTO.isHidden || false;
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

    newOrder.documentSum = this.calculateDocumentSum(createOrderDTO);

    return await this.ordersRepository.save(newOrder);
  }

  private calculateDocumentSum(createOrderDTO: CreateOrderDTO): number {
    return (
      createOrderDTO.orderLines.reduce(
        (acc, cur) => (acc += cur.price * cur.qty),
        0,
      ) +
      createOrderDTO.orderServiceLines.reduce(
        (acc, cur) => (acc += cur.price * cur.qty),
        0,
      )
    );
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
    const order = await this.createBaseQueryBuilder()
      .where('order.id = :orderId', { orderId })
      .andWhere('order.status = FALSE')
      .leftJoinAndSelect('order.orderLines', 'orderLines')
      .leftJoinAndSelect('order.orderServiceLines', 'orderServiceLines')
      .leftJoinAndSelect('order.technicalProcesses', 'technicalProcesses')
      .getOne();

    if (!order) {
      throw new NotFoundException(
        `Order with id: ${orderId} and status: false not found`,
      );
    }

    const updatedOrderLinesIds = updateOrderDTO.orderLines
      .filter((line) => line['id'])
      .map((line) => line['id']);
    const orderLinesToDelete = order.orderLines.filter(
      (line) => !updatedOrderLinesIds.includes(line.id),
    );

    const updatedOrderServiceLinesIds = updateOrderDTO.orderServiceLines
      .filter((line) => line['id'])
      .map((line) => line['id']);
    const orderServiceLinesToDelete = order.orderServiceLines.filter(
      (line) => !updatedOrderServiceLinesIds.includes(line.id),
    );

    const updated = Object.assign(order, updateOrderDTO);

    updated.technicalProcesses =
      await this.getTechnicalProcesses(updateOrderDTO);

    updated.documentSum = this.calculateDocumentSum(updated);

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
    const order = await this.ordersRepository.findOne({
      where: { id: orderId, status: false },
      relations: ['orderLines', 'orderServiceLines'],
    });

    if (!order) {
      throw new NotFoundException(
        `Order with id: ${orderId} and status: false not found`,
      );
    }

    return await this.ordersRepository.remove(order);
  }

  async changeOrderStatus(orderId: number): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException(`Order with id: ${orderId} not found`);
    }

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

    const orders = await this.createBaseQueryBuilder()
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

    return orderPrefix + (Math.max(...numbers, 0) + 1);
  }
}
