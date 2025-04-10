import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { InvoiceService } from '../invoice/invoice.service';

import { CommissionInvoice } from './entities';
import { CreateCommissionInvoiceDTO, UpdateCommissionInvoiceDTO } from './dto';

@Injectable()
export class CommissionInvoiceService {
  constructor(
    @InjectRepository(CommissionInvoice)
    private readonly commissionRepository: Repository<CommissionInvoice>,
    private readonly invoicesService: InvoiceService,
  ) {}

  async getCommissionInvoicess() {
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

  async getCommissionInvoiceById(commissionId: number) {
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
  ) {
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

    return await this.commissionRepository.save(newCommissionIvoice);
  }

  async updateCommissionInvoice(
    commissionId: number,
    updateCommissionInvoiceDTO: UpdateCommissionInvoiceDTO,
  ) {
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

    return await this.commissionRepository.save(updated);
  }

  async removeCommission(commissionId: number) {
    const commission = await this.commissionRepository.findOneBy({
      id: commissionId,
      status: false,
    });

    return this.commissionRepository.remove(commission);
  }

  async changeCommissionStatus(commissionId: number) {
    const commission = await this.commissionRepository.findOneBy({
      id: commissionId,
    });

    commission.status = commission.status ? false : true;

    // make financial changes

    return await this.commissionRepository.save(commission);
  }
}
