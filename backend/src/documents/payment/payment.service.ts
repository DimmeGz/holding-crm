import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';

import { CompaniesService } from '../../companies';
import { InvoiceService } from '../invoices';
import { LibsService } from '../../libs';

import { Payment } from './entities';
import { CreatePaymentDTO, UpdatePaymentDTO } from './dto';
import { PaymentLine } from './entities/payment-line.entity';
import { BaseDocumentsQueryDTO } from '../common/dto/query-dto';
import { DocumentTypeEnum } from '../common/enums';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentsRepository: Repository<Payment>,
    @InjectDataSource() private dataSource: DataSource,
    @Inject(forwardRef(() => InvoiceService))
    private readonly invoiceService: InvoiceService,
    private readonly companiesService: CompaniesService,
    private readonly libsService: LibsService,
  ) {}

  private createBaseQueryBuilder(): SelectQueryBuilder<Payment> {
    return this.paymentsRepository.createQueryBuilder('payment');
  }

  private applyPaymentListSelect(
    qb: SelectQueryBuilder<Payment>,
  ): SelectQueryBuilder<Payment> {
    return qb
      .leftJoin('payment.paymentLines', 'paymentLine')
      .leftJoin('paymentLine.invoice', 'invoice')
      .select([
        'payment.id',
        'payment.sellerId',
        'payment.buyerId',
        'payment.status',
        'payment.documentSum',
        'payment.currencyId',
        'payment.expectedDate',
        'paymentLine.id',
        'invoice.id',
        'invoice.invoiceNumber',
      ]);
  }

  private applyPaymentDetailSelect(
    qb: SelectQueryBuilder<Payment>,
  ): SelectQueryBuilder<Payment> {
    return qb
      .leftJoin('payment.paymentLines', 'paymentLine')
      .leftJoin('paymentLine.invoice', 'invoice')
      .select([
        'payment.id',
        'payment.status',
        'payment.documentSum',
        'payment.expectedDate',
        'payment.sellerId',
        'payment.buyerId',
        'payment.currencyId',
        'paymentLine.id',
        'paymentLine.amount',
        'invoice.id',
        'invoice.invoiceNumber',
      ]);
  }

  private applyQueryFilter(
    qb: SelectQueryBuilder<Payment>,
    query?: BaseDocumentsQueryDTO,
  ) {
    if (!query || Object.keys(query).length === 0) {
      return qb; // Return the query builder unmodified if query is empty
    }

    if (query.type) {
      if (query.type === DocumentTypeEnum.SELLER) {
        qb.andWhere('contract.sellerId = :sellerId', {
          sellerId: query.company,
        });
      } else {
        qb.andWhere('contract.buyerId = :buyerId', {
          buyerId: query.company,
        });
      }
    } else if (query.company) {
      qb.andWhere(
        '(contract.sellerId = :company OR contract.buyerId = :company)',
        { company: query.company },
      );
    }

    return qb;
  }

  async getPayments(query?: BaseDocumentsQueryDTO): Promise<Payment[]> {
    return await this.applyQueryFilter(
      this.applyPaymentListSelect(this.createBaseQueryBuilder()),
      query,
    )
      .orderBy('payment.id', 'DESC')
      .getMany();
  }

  async getPaymentById(paymentId: number): Promise<{ payment: Payment }> {
    const payment = await this.applyPaymentDetailSelect(
      this.createBaseQueryBuilder(),
    )
      .where('payment.id = :paymentId', { paymentId })
      .getOne();

    if (!payment) {
      throw new NotFoundException(`Payment with id: ${paymentId} not found`);
    }

    return { payment };
  }

  async getPaymentsByInvoiceId(invoiceId: number): Promise<Payment[]> {
    return await this.createBaseQueryBuilder()
      .leftJoin('payment.paymentLines', 'paymentLine')
      .where('paymentLine.invoiceId = :invoiceId', { invoiceId })
      .select(['payment.id', 'payment.status'])
      .orderBy('payment.id', 'ASC')
      .getMany();
  }

  async createPayment(createPaymentDTO: CreatePaymentDTO): Promise<Payment> {
    const newPayment = this.paymentsRepository.create(createPaymentDTO);

    newPayment.createdAt = new Date();
    newPayment.comment = newPayment.comment || '';
    newPayment.status = false;

    const { invoiceIds, documentSum } = this.extractPaymentLinesData(
      newPayment.paymentLines,
    );

    newPayment.documentSum = documentSum;
    newPayment.technicalProcesses =
      await this.libsService.getTechnicalProcessesByInvoiceIds(invoiceIds);

    return await this.paymentsRepository.save(newPayment);
  }

  private extractPaymentLinesData(paymentLines: Partial<PaymentLine>[]): {
    invoiceIds: number[];
    documentSum: number;
  } {
    return paymentLines.reduce(
      (acc, cur) => {
        acc.invoiceIds.push(cur.invoiceId);
        acc.documentSum += cur.amount;
        return acc;
      },
      { invoiceIds: [], documentSum: 0 },
    );
  }

  async updatePayment(
    paymentId: number,
    updatePaymentDTO: UpdatePaymentDTO,
  ): Promise<Payment> {
    const payment = await this.createBaseQueryBuilder()
      .where('payment.id = :paymentId', { paymentId })
      .andWhere('payment.status = false')
      .leftJoinAndSelect('payment.paymentLines', 'paymentLine')
      .getOne();

    if (!payment) {
      throw new NotFoundException(
        `Payment with id: ${paymentId} and status: false not found`,
      );
    }

    const updatedPaymentLinesIds = updatePaymentDTO.paymentLines
      .filter((line) => line['id'])
      .map((line) => line['id']);
    const paymentLinesToDelete = payment.paymentLines.filter(
      (line) => !updatedPaymentLinesIds.includes(line.id),
    );

    const updated = Object.assign(payment, updatePaymentDTO);

    const { invoiceIds, documentSum } = this.extractPaymentLinesData(
      updated.paymentLines,
    );
    updated.documentSum = documentSum;
    updated.technicalProcesses =
      await this.libsService.getTechnicalProcessesByInvoiceIds(invoiceIds);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

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

  async removePayment(paymentId: number): Promise<Payment> {
    const payment = await this.paymentsRepository.findOne({
      where: { id: paymentId, status: false },
      relations: ['paymentLines'],
    });

    if (!payment) {
      throw new NotFoundException(
        `Payment with id: ${paymentId} and status: false not found`,
      );
    }

    return await this.paymentsRepository.remove(payment);
  }

  async changePaymentStatus(paymentId: number): Promise<Payment> {
    const payment = await this.paymentsRepository.findOne({
      where: { id: paymentId },
      relations: ['paymentLines'],
    });

    if (!payment) {
      throw new NotFoundException(`Payment with id: ${paymentId} not found`);
    }

    payment.status = !payment.status;

    await this.companiesService.changeAccountsBalances({
      sellerId: payment.sellerId,
      buyerId: payment.buyerId,
      currencyId: payment.currencyId,
      status: payment.status,
      amount: payment.documentSum,
    });
    await this.invoiceService.changePaymentBalance({
      status: payment.status,
      paymentLines: payment.paymentLines,
    });

    return await this.paymentsRepository.save(payment);
  }
}
