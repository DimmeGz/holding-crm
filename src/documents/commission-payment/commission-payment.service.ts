import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommissionPayment } from './entities';
import { Repository } from 'typeorm';

@Injectable()
export class CommissionPaymentService {
  constructor(
    @InjectRepository(CommissionPayment)
    private readonly commissionPaymentsRepository: Repository<CommissionPayment>,
  ) {}

  async getCommisionPayments() {
    const commissionPayments = await this.commissionPaymentsRepository
      .createQueryBuilder('commissionPayment')
      .leftJoin('commissionPayment.seller', 'seller')
      .leftJoin('commissionPayment.buyer', 'buyer')
      .leftJoin('commissionPayment.commissionInvoice', 'commissionInvoice')
      .leftJoin('commissionPayment.currency', 'currency')
      .select([
        'commissionPayment.id',
        'commissionPayment.status',
        'commissionPayment.amount',
        'commissionPayment.expectedDate',
        'seller.name',
        'buyer.name',
        'commissionInvoice.id',
        'currency.name',
      ])
      .orderBy('commissionPayment.id', 'DESC')
      .getMany();

    return commissionPayments;
  }

  async getCommisionPaymentById(commissionPaymentId: number) {
    const commissionPayment = await this.commissionPaymentsRepository
      .createQueryBuilder('commissionPayment')
      .leftJoin('commissionPayment.seller', 'seller')
      .leftJoin('commissionPayment.buyer', 'buyer')
      .leftJoin('commissionPayment.commissionInvoice', 'commissionInvoice')
      .leftJoin('commissionPayment.currency', 'currency')
      .select([
        'commissionPayment.id',
        'commissionPayment.status',
        'commissionPayment.amount',
        'commissionPayment.expectedDate',
        'seller.name',
        'buyer.name',
        'commissionInvoice.id',
        'currency.name',
      ])
      .where('commissionPayment.id = :commissionPaymentId', {
        commissionPaymentId,
      })
      .getMany();

    return commissionPayment;
  }
}
