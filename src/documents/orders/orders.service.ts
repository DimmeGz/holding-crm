import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Order } from './entities';
import { OrderConfirmation } from '../orders-confirmation/entities';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
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
      .leftJoinAndSelect(
        (qb) =>
          qb
            .from('documents_orderconfirmation', 'confirmation')
            .select('MAX(id)', 'id'),
        // .addSelect('')
        // .addSelect('orderConfirmation.orderId', 'orderId')
        // .addSelect('orderConfirmation.createdAt', 'createdAt') // Assuming you have a createdAt field
        // .from('documents_orderconfirmation', 'orderConfirmation'),
        // .orderBy('orderConfirmation.createdAt', 'DESC')
        // .distinctOn(['orderConfirmation.orderId']),
        'documents_orderconfirmation',
        'documents_orderconfirmation.order_id = order.id',
      )
      .where('order.id = :orderId', { orderId })
      .getOne();

    return order;
  }
}
