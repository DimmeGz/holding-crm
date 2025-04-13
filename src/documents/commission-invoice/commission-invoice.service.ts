import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CompaniesService } from '../../companies';
import { InvoiceService } from '../invoice';

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

  async getCommissionInvoicess(): Promise<CommissionInvoice[]> {
    const commissions = await this.commissionRepository
      .createQueryBuilder('commission')
      .leftJoin('commission.seller', 'seller')
      .leftJoin('commission.buyer', 'buyer')
      .leftJoin('commission.currency', 'currency')
      .leftJoin('commission.invoice', 'invoice')
      .leftJoin('invoice.children', 'invoiceChildren')
      .select([
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
      ])
      .orderBy('commission.id', 'DESC')
      .getMany();

    return commissions;
  }

  async getCommissionInvoiceById(
    commissionId: number,
  ): Promise<CommissionInvoice> {
    const commission = await this.commissionRepository
      .createQueryBuilder('commission')
      .leftJoin('commission.seller', 'seller')
      .leftJoin('commission.buyer', 'buyer')
      .leftJoin('commission.currency', 'currency')
      .leftJoin('commission.invoice', 'invoice')
      .leftJoin('invoice.children', 'invoiceChildren')
      .select([
        'commission.id',
        'commission.status',
        'commission.rate',
        'commission.documentSum',
        'commission.creationDate',
        'commission.paymentBalance',
        'currency.name',
        'seller.name',
        'buyer.name',
        'invoice.id',
        'invoice.invoiceNumber',
        'invoice.documentSum',
        'invoiceChildren.id',
        'invoiceChildren.invoiceNumber',
        'invoiceChildren.documentSum',
      ])
      .where('commission.id = :commissionId', { commissionId })
      .getOne();

    return commission;
  }

  async createCommissionInvoice(
    createCommissionInvoiceDTO: CreateCommissionInvoiceDTO,
  ): Promise<CommissionInvoice> {
    const newCommissionIvoice = new CommissionInvoice(
      createCommissionInvoiceDTO,
    );
    newCommissionIvoice.status = false;
    newCommissionIvoice.createdAt = new Date();
    newCommissionIvoice.creationDate =
      newCommissionIvoice.creationDate || newCommissionIvoice.createdAt;
    newCommissionIvoice.comment = newCommissionIvoice.comment || '';

    const invoiceData = await this.invoicesService.getInvoiceDataForCommission(
      createCommissionInvoiceDTO.invoiceId,
    );
    const childrenSum = invoiceData.children.reduce(
      (acc, cur) => (acc += cur.documentSum),
      0,
    );

    newCommissionIvoice.documentSum =
      (childrenSum * newCommissionIvoice.rate) / 100;
    newCommissionIvoice.paymentBalance = newCommissionIvoice.documentSum;

    newCommissionIvoice.technicalProcesses = invoiceData.technicalProcesses;

    return await this.commissionRepository.save(newCommissionIvoice);
  }

  async updateCommissionInvoice(
    commissionId: number,
    updateCommissionInvoiceDTO: UpdateCommissionInvoiceDTO,
  ): Promise<CommissionInvoice> {
    const commission = await this.commissionRepository.findOneBy({
      id: commissionId,
      status: false,
    });

    const updated = Object.assign(commission, updateCommissionInvoiceDTO);

    const invoiceData = await this.invoicesService.getInvoiceDataForCommission(
      commission.invoiceId,
    );
    const childrenSum = invoiceData.children.reduce(
      (acc, cur) => (acc += cur.documentSum),
      0,
    );

    updated.documentSum = (childrenSum * updated.rate) / 100;
    updated.technicalProcesses = invoiceData.technicalProcesses;

    return await this.commissionRepository.save(updated);
  }

  async removeCommission(commissionId: number): Promise<CommissionInvoice> {
    try {
      const commission = await this.commissionRepository.findOneBy({
        id: commissionId,
        status: false,
      });

      return this.commissionRepository.remove(commission);
    } catch (e) {
      throw new NotFoundException(e);
    }
  }

  async changeCommissionStatus(
    commissionId: number,
  ): Promise<CommissionInvoice> {
    const commission = await this.commissionRepository.findOneBy({
      id: commissionId,
    });

    // TODO: make transaction

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
