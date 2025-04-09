import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { LibsService } from '../../libs/libs.service';

import { Payment } from './entities';
import { CreatePaymentDTO } from './dto';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentsRepository: Repository<Payment>,
    private readonly libsService: LibsService,
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

  async getPaymentsByInvoiceId(invoiceId: number) {
    const payments = await this.paymentsRepository
      .createQueryBuilder('payment')
      .leftJoin('payment.paymentLines', 'paymentLine')
      .where('paymentLine.invoiceId = :invoiceId', { invoiceId })
      .select(['payment.id', 'payment.status'])
      .orderBy('payment.id', 'ASC')
      .getMany();

    return payments;
  }

  async createPayment(createPaymentDTO: CreatePaymentDTO) {
    const newPayment = new Payment(createPaymentDTO);
    newPayment.createdAt = new Date();
    newPayment.comment = newPayment.comment || '';
    newPayment.status = false;

    const paymentLinesData = newPayment.paymentLines.reduce(
      (acc, cur) => {
        acc.invoiceIds.push(cur.invoiceId);
        acc.documentSum += cur.amount;
        return acc;
      },
      { invoiceIds: [], documentSum: 0 },
    );

    newPayment.documentSum = paymentLinesData.documentSum;
    newPayment.technicalProcesses =
      await this.libsService.getTechnicalProcessesByInvoiceIds(
        paymentLinesData.invoiceIds,
      );

    return await this.paymentsRepository.save(newPayment);
  }
}
