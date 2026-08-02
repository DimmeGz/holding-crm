import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';

import { CompaniesService } from '../../companies';
import { InvoiceService } from '../invoices';

import { CommissionInvoice } from './entities';
import {
  CreateCommissionInvoiceDTO,
  UpdateCommissionInvoiceDTO,
  UpdateCommissionPaymentBalanceDTO,
} from './dto';

@Injectable()
export class CommissionInvoiceService {
  constructor(
    @InjectRepository(CommissionInvoice)
    private readonly commissionRepository: Repository<CommissionInvoice>,
    private readonly invoicesService: InvoiceService,
    private readonly companiesService: CompaniesService,
  ) {}

  private createBaseQueryBuilder(): SelectQueryBuilder<CommissionInvoice> {
    return this.commissionRepository
      .createQueryBuilder('commission')
      .leftJoin('commission.invoice', 'invoice')
      .leftJoin('invoice.children', 'invoiceChildren');
  }

  private applyBaseSelect(
    qb: SelectQueryBuilder<CommissionInvoice>,
  ): SelectQueryBuilder<CommissionInvoice> {
    return qb.select([
      'commission.id',
      'commission.sellerId',
      'commission.buyerId',
      'commission.status',
      'commission.rate',
      'commission.documentSum',
      'commission.paymentBalance',
      'commission.currencyId',
      'invoice.id',
      'invoice.invoiceNumber',
      'invoiceChildren.id',
      'invoiceChildren.invoiceNumber',
    ]);
  }

  async getCommissionInvoices(): Promise<CommissionInvoice[]> {
    const qb = this.createBaseQueryBuilder();

    this.applyBaseSelect(qb);

    return qb.orderBy('commission.id', 'DESC').getMany();
  }

  async getCommissionInvoiceById(
    commissionId: number,
  ): Promise<CommissionInvoice> {
    const qb = this.createBaseQueryBuilder();

    this.applyBaseSelect(qb);
    qb.addSelect([
      'commission.creationDate',
      'commission.paymentBalance',
      'invoice.documentSum',
      'invoiceChildren.documentSum',
    ]);

    const commission = await qb
      .where('commission.id = :commissionId', { commissionId })
      .getOne();

    if (!commission) {
      throw new NotFoundException(
        `Commission Invoice with ID ${commissionId} not found`,
      );
    }

    return commission;
  }

  async createCommissionInvoice(
    createCommissionInvoiceDTO: CreateCommissionInvoiceDTO,
  ): Promise<CommissionInvoice> {
    const newCommissionInvoice = this.commissionRepository.create(
      createCommissionInvoiceDTO,
    );
    newCommissionInvoice.status = false;
    newCommissionInvoice.createdAt = new Date();
    newCommissionInvoice.creationDate =
      newCommissionInvoice.creationDate || newCommissionInvoice.createdAt;
    newCommissionInvoice.comment = newCommissionInvoice.comment || '';

    await this.calculateAndSetDocumentSumAndBalance(newCommissionInvoice);

    return await this.commissionRepository.save(newCommissionInvoice);
  }

  async updateCommissionInvoice(
    commissionId: number,
    updateCommissionInvoiceDTO: UpdateCommissionInvoiceDTO,
  ): Promise<CommissionInvoice> {
    const commission = await this.commissionRepository.findOneBy({
      id: commissionId,
      status: false,
    });

    if (!commission) {
      throw new NotFoundException(
        `Commission invoice with id: ${commissionId} and status: false not found`,
      );
    }

    Object.assign(commission, updateCommissionInvoiceDTO);

    await this.calculateAndSetDocumentSumAndBalance(commission);

    return await this.commissionRepository.save(commission);
  }

  private async calculateAndSetDocumentSumAndBalance(
    commission: CommissionInvoice,
  ): Promise<void> {
    const invoiceData = await this.invoicesService.getInvoiceDataForCommission(
      commission.invoiceId,
    );
    const childrenSum = invoiceData.children.reduce(
      (acc, cur) => (acc += cur.documentSum),
      0,
    );

    commission.documentSum = (childrenSum * commission.rate) / 100;
    commission.paymentBalance = commission.documentSum;
    commission.technicalProcesses = invoiceData.technicalProcesses;
  }

  async removeCommission(commissionId: number): Promise<CommissionInvoice> {
    const commission = await this.commissionRepository.findOneBy({
      id: commissionId,
      status: false,
    });
    if (!commission) {
      throw new NotFoundException(
        `Commission invoice with id: ${commissionId} and status: false not found`,
      );
    }

    return this.commissionRepository.remove(commission);
  }

  async changeCommissionStatus(
    commissionId: number,
  ): Promise<CommissionInvoice> {
    const commission = await this.commissionRepository.findOneBy({
      id: commissionId,
    });

    if (!commission) {
      throw new NotFoundException(
        `Commission invoice with id: ${commissionId} not found`,
      );
    }

    commission.status = !commission.status;

    await this.companiesService.changeInvoiceStatusBalances({
      sellerId: commission.sellerId,
      buyerId: commission.buyerId,
      currencyId: commission.currencyId,
      status: commission.status,
      amount: commission.documentSum,
    });

    return await this.commissionRepository.save(commission);
  }

  async changeCommissionPaymentBalance(
    updateBalanceDTO: UpdateCommissionPaymentBalanceDTO,
  ): Promise<void> {
    const changeBalanceData =
      updateBalanceDTO.commissionPaymentLines.reduce(
        (acc, cur) => {
          if (!cur.commissionInvoiceId) {
            return acc;
          }
          if (!acc[cur.commissionInvoiceId]) {
            acc[cur.commissionInvoiceId] = Number(cur.amount) || 0;
          } else {
            acc[cur.commissionInvoiceId] += Number(cur.amount) || 0;
          }
          return acc;
        },
        {} as Record<number, number>,
      );

    const commissionInvoiceIds = Object.keys(changeBalanceData).map(Number);
    if (!commissionInvoiceIds.length) {
      return;
    }

    const commissions = await this.createBaseQueryBuilder()
      .where('commission.id IN (:...commissionInvoiceIds)', {
        commissionInvoiceIds,
      })
      .getMany();

    if (updateBalanceDTO.status) {
      commissions.forEach(
        (commission) =>
          (commission.paymentBalance -= changeBalanceData[commission.id]),
      );
    } else {
      commissions.forEach(
        (commission) =>
          (commission.paymentBalance += changeBalanceData[commission.id]),
      );
    }

    await this.commissionRepository.save(commissions);
  }
}
