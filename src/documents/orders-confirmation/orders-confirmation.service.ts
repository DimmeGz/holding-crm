import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderConfirmation } from './entities';
import { Repository } from 'typeorm';

@Injectable()
export class OrdersConfirmationService {
  constructor(
    @InjectRepository(OrderConfirmation)
    private readonly orderConfirmationsRepository: Repository<OrderConfirmation>,
  ) {}

  async getConfirmationsByOrderId(orderId: number) {
    return await this.orderConfirmationsRepository
      .createQueryBuilder('orderConfirmation')
      .where('orderConfirmation.orderId = :orderId', { orderId })
      .select(['orderConfirmation.id', 'orderConfirmation.confirmationNumber'])
      .getMany();
  }
}
