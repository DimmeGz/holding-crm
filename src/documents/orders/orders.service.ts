import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Order } from './entities';
import { InvoiceService } from '../invoice/invoice.service';
import { CreateOrderDTO } from './dto';
import { GoodsService } from '../../goods';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    private readonly invoiceService: InvoiceService,
    private readonly goodsService: GoodsService,
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

    return { order, invoices };
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
    createOrderDTO['isHidden'] = false;
    createOrderDTO['createdAt'] = new Date();
    createOrderDTO.signatureDate =
      createOrderDTO.signatureDate || createOrderDTO['createdAt'];
    createOrderDTO.comment = createOrderDTO.comment || '';
    createOrderDTO.transportPlace = createOrderDTO.transportPlace || '';
    createOrderDTO['status'] = false;
    createOrderDTO.paymentDelay = createOrderDTO.paymentDelay || 0;
    createOrderDTO.vat = createOrderDTO.vat || 0;

    createOrderDTO['documentSum'] =
      createOrderDTO.orderLines.reduce(
        (acc, cur) => (acc += cur.price * cur.qty),
        0,
      ) +
      createOrderDTO.orderServiceLines.reduce(
        (acc, cur) => (acc += cur.price * cur.qty),
        0,
      );

    createOrderDTO['technicalProcesses'] =
      await this.getTechnicalProcesses(createOrderDTO);

    const newOrder = new Order(createOrderDTO);

    return await this.ordersRepository.save(newOrder);
  }

  private async getTechnicalProcesses(createOrderDTO: CreateOrderDTO) {
    const productManIds = createOrderDTO.orderLines.map(
      (line) => line.productManId,
    );
    const productBuyIds = createOrderDTO.orderLines.map(
      (line) => line.productBuyId,
    );
    const productIds = [...new Set([...productManIds, ...productBuyIds])];
    const productProcesses =
      await this.goodsService.getTechnicalProcessesFromProductIds(productIds);

    const serviceIds = createOrderDTO.orderServiceLines.map(
      (line) => line.serviceId,
    );
    const serviceProcesses =
      await this.goodsService.getTechnicalProcessesFromServiceIds(serviceIds);

    const technicalProcesses = [
      ...new Set([...productProcesses, ...serviceProcesses]),
    ];

    return technicalProcesses.map((process) => ({ id: process.id }));
  }
}
