import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Invoice } from './entities';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
  ) {}

  async getInvoices() {
    const invoices = await this.invoiceRepository
      .createQueryBuilder('invoice')
      .leftJoin('invoice.seller', 'seller')
      .leftJoin('invoice.buyer', 'buyer')
      .leftJoin('invoice.recipient', 'recipient')
      .leftJoin('invoice.parent', 'parent')
      .select([
        'invoice.id',
        'invoice.number',
        'seller.id',
        'seller.name',
        'buyer.id',
        'buyer.name',
        'recipient.id',
        'recipient.name',
        'invoice.status',
        'invoice.documentSum',
        'parent.id',
        'parent.number',
      ])
      .orderBy('invoice.id', 'DESC')
      .getMany();

    return invoices;
  }
}
