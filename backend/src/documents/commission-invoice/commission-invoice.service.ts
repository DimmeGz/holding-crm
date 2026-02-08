import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';

import { CompaniesService } from '../../companies';
import { InvoiceService } from '../invoices';

import { CommissionInvoice } from './entities';
import { CreateCommissionInvoiceDTO, UpdateCommissionInvoiceDTO } from './dto';

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
      .leftJoin('commission.seller', 'seller')
      .leftJoin('commission.buyer', 'buyer')
      .leftJoin('commission.currency', 'currency')
      .leftJoin('commission.invoice', 'invoice')
      .leftJoin('invoice.children', 'invoiceChildren');
  }

  private applyBaseSelect(
    qb: SelectQueryBuilder<CommissionInvoice>,
  ): SelectQueryBuilder<CommissionInvoice> {
    return qb.select([
      'commission.id',
      'commission.status',
      'commission.rate',
      'commission.documentSum',
      'currency.name',
      'seller.name',
      'buyer.name',
      'invoice.id',
      'invoice.invoiceNumber',
      'invoiceChildren.id',
      'invoiceChildren.invoiceNumber',
    ]);
  }

  async getCommissionInvoicess(): Promise<CommissionInvoice[]> {
    return await this.applyBaseSelect(this.createBaseQueryBuilder())
      .orderBy('commission.id', 'DESC')
      .getMany();
  }

  async getCommissionInvoiceById(
    commissionId: number,
  ): Promise<CommissionInvoice> {
    const commission = await this.applyBaseSelect(this.createBaseQueryBuilder())
      .addSelect([
        'commission.creationDate',
        'commission.paymentBalance',
        'invoice.documentSum',
        'invoiceChildren.documentSum',
      ])
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
}
