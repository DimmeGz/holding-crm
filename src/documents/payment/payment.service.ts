import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Payment } from './entities';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentsRepository: Repository<Payment>,
  ) {}

  async getPayments() {
    const payments = await this.paymentsRepository
      .createQueryBuilder('payment')
      .leftJoin('payment.seller', 'seller')
      .leftJoin('payment.buyer', 'buyer')
      .leftJoin('payment.paymentLines', 'paymentLine')
      .leftJoin('paymentLine.invoice', 'invoice')
      .select([
        'payment.id',
        'payment.status',
        'payment.documentSum',
        'payment.expected_date',
        'seller.name',
        'buyer.name',
        'paymentLine.id',
        'invoice.invoiceNumber',
      ])
      .orderBy('payment.id', 'DESC')
      .getMany();

    return payments;
  }

  async getPaymentById(paymentId: number) {
    const payment = await this.paymentsRepository
      .createQueryBuilder('payment')
      .leftJoin('payment.seller', 'seller')
      .leftJoin('payment.buyer', 'buyer')
      .leftJoin('payment.paymentLines', 'paymentLine')
      .leftJoin('paymentLine.invoice', 'invoice')
      .where('payment.id = :paymentId', { paymentId })
      .select([
        'payment.id',
        'payment.status',
        'payment.documentSum',
        'payment.expected_date',
        'seller.name',
        'buyer.name',
        'paymentLine.id',
        'paymentLine.amount',
        'invoice.id',
        'invoice.invoiceNumber',
      ])
      .orderBy('payment.id', 'DESC')
      .getMany();

    return payment;
  }
}
