import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommissionInvoice } from './entities';
import { Repository } from 'typeorm';

@Injectable()
export class CommissionInvoiceService {
  constructor(
    @InjectRepository(CommissionInvoice)
    private readonly commissionRepository: Repository<CommissionInvoice>,
  ) {}

  async getCommissions() {
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
}
