import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';

import { DataSource, Repository } from 'typeorm';

import { LibsService } from '../../libs/libs.service';

import { Payment } from './entities';
import { CreatePaymentDTO, UpdatePaymentDTO } from './dto';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentsRepository: Repository<Payment>,
    @InjectDataSource() private dataSource: DataSource,
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

  async updatePayment(paymentId: number, updatePaymentDTO: UpdatePaymentDTO) {
    const payment = await this.paymentsRepository
      .createQueryBuilder('payment')
      .leftJoinAndSelect('payment.paymentLines', 'paymentLine')
      .where('payment.id = :paymentId', { paymentId })
      .andWhere('payment.status = false')
      .getOne();

    const updatedPaymentLinesIds = [];
    let paymentLinesToDelete = [];

    if (updatePaymentDTO.paymentLines && updatePaymentDTO.paymentLines.length) {
      for (const line of updatePaymentDTO.paymentLines) {
        if (line['id']) {
          updatedPaymentLinesIds.push(line['id']);
        }
      }
      paymentLinesToDelete = payment.paymentLines.filter(
        (line) => !updatedPaymentLinesIds.includes(line.id),
      );
    }

    const updated = Object.assign(payment, updatePaymentDTO);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    // TODO: update technical processes

    try {
      if (paymentLinesToDelete.length) {
        await queryRunner.manager.remove(paymentLinesToDelete);
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

  async removePayment(paymentId: number) {
    const invoice = await this.paymentsRepository.findOne({
      where: { id: paymentId, status: false },
      relations: ['paymentLines'],
    });
    return await this.paymentsRepository.remove(invoice);
  }

  async changePaymentStatus(paymentId: number) {
    const payment = await this.paymentsRepository.findOne({
      where: { id: paymentId },
    });

    payment.status = payment.status ? false : true;

    // TODO: make finanshial changes in companies

    return await this.paymentsRepository.save(payment);
  }
}
