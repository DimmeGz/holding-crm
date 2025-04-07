import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Invoice } from './entities';
import { ShipmentService } from '../shipment';
import { PaymentService } from '../payment/payment.service';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
    private readonly shipmentsService: ShipmentService,
    private readonly paymentsService: PaymentService,
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

  async getInvoiceById(invoiceId: number) {
    const invoice = await this.invoiceRepository
      .createQueryBuilder('invoice')
      .leftJoin('invoice.seller', 'seller')
      .leftJoin('invoice.sellerWarehouse', 'sellerWarehouse')
      .leftJoin('invoice.buyer', 'buyer')
      .leftJoin('invoice.buyerWarehouse', 'buyerWarehouse')
      .leftJoin('invoice.recipient', 'recipient')
      .leftJoin('invoice.recipientWarehouse', 'recipientWarehouse')
      .leftJoin('invoice.parent', 'parent')
      .leftJoin('invoice.currency', 'currency')
      .leftJoin('invoice.invoiceLines', 'invoiceLine')
      .leftJoin('invoiceLine.product', 'product')
      .leftJoin('invoiceLine.batch', 'batch')
      .leftJoin('invoiceLine.countryOfOrigin', 'countryOfOrigin')
      .leftJoin('invoiceLine.package', 'package')
      .where('invoice.id = :invoiceId', { invoiceId })
      .select([
        'invoice.invoiceNumber',
        'invoice.status',
        'invoice.expectedDate',
        'invoice.paymentBalance',
        'parent.id',
        'parent.invoiceNumber',
        'seller.name',
        'sellerWarehouse.name',
        'buyer.name',
        'buyerWarehouse.name',
        'recipient.name',
        'recipientWarehouse.name',
        'currency.name',
        'invoice.vat',
        'invoice.paymentDelay',
        'invoice.incoterms',
        'invoice.transportPlace',
        'invoice.ponz',
        'invoice.grossWeight',
        'invoice.transportAmount',
        'invoice.comment',
        'invoice.separation',
        'invoice.reportPeriod',
        'invoice.contractInfo',
        'invoiceLine',
        'product.name',
        'batch.id',
        'batch.name',
        'countryOfOrigin.name',
        'package.name',
        'package.capacity',
      ])
      .getOne();

    const shipments =
      await this.shipmentsService.getShipmentsByInvoiceId(invoiceId);
    const payments =
      await this.paymentsService.getPaymentsByInvoiceId(invoiceId);

    return { invoice, shipments, payments };
  }

  async getInvoicesByOrderId(orderId: number) {
    const invoices = await this.invoiceRepository
      .createQueryBuilder('invoice')
      .leftJoin('invoice.invoiceLines', 'invoiceLine')
      .where('invoiceLine.orderId = :orderId', { orderId })
      .orderBy('invoice.id', 'ASC')
      .select(['invoice.id', 'invoice.status', 'invoice.invoiceNumber'])
      .getMany();

    for await (const invoice of invoices) {
      invoice['shipments'] =
        await this.shipmentsService.getShipmentsByInvoiceId(invoice.id);
      invoice['payments'] = await this.paymentsService.getPaymentsByInvoiceId(
        invoice.id,
      );
    }

    return invoices;
  }
}
