import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderConfirmation } from './entities';
import { Repository, SelectQueryBuilder } from 'typeorm';

@Injectable()
export class OrdersConfirmationService {
  constructor(
    @InjectRepository(OrderConfirmation)
    private readonly orderConfirmationsRepository: Repository<OrderConfirmation>,
  ) {}

  private createBaseQueryBuilder(): SelectQueryBuilder<OrderConfirmation> {
    return this.orderConfirmationsRepository.createQueryBuilder(
      'orderConfirmation',
    );
  }

  private applyBaseSelect(
    qb: SelectQueryBuilder<OrderConfirmation>,
  ): SelectQueryBuilder<OrderConfirmation> {
    return qb.select([
      'orderConfirmation.id',
      'orderConfirmation.confirmationNumber',
    ]);
  }

  async getConfirmationsByOrderId(
    orderId: number,
  ): Promise<OrderConfirmation[]> {
    return await this.applyBaseSelect(this.createBaseQueryBuilder())
      .where('orderConfirmation.orderId = :orderId', { orderId })
      .getMany();
  }
}
