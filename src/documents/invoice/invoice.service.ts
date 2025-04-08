import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ShipmentService } from '../shipment';
import { PaymentService } from '../payment/payment.service';
import { GoodsService } from '../../goods';

import { Invoice } from './entities';
import { CreateInvoiceDTO } from './dto';
import {
  getProductIdsFromProductLines,
  getServiceIdsFromServiceLines,
} from '../../common/utils';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
    private readonly goodsService: GoodsService,
    private readonly paymentsService: PaymentService,
    private readonly shipmentsService: ShipmentService,
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

  async createInvoice(createInvoiceDTO: CreateInvoiceDTO) {
    createInvoiceDTO['status'] = false;
    createInvoiceDTO['createdAt'] = new Date();
    createInvoiceDTO.reportPeriod =
      createInvoiceDTO.reportPeriod || createInvoiceDTO['createdAt'];
    createInvoiceDTO.comment = createInvoiceDTO.comment || '';
    createInvoiceDTO.transportPlace = createInvoiceDTO.transportPlace || '';
    createInvoiceDTO.paymentDelay = createInvoiceDTO.paymentDelay || 0;
    createInvoiceDTO.vat = createInvoiceDTO.vat || 0;
    createInvoiceDTO.separation = createInvoiceDTO.separation || false;

    createInvoiceDTO['technicalProcesses'] =
      await this.getTechnicalProcesses(createInvoiceDTO);

    createInvoiceDTO['documentSum'] =
      createInvoiceDTO.invoiceLines.reduce(
        (acc, cur) => (acc += cur.price * cur.qty),
        0,
      ) +
      createInvoiceDTO.invoiceServiceLines.reduce(
        (acc, cur) => (acc += cur.price * cur.qty),
        0,
      );
    createInvoiceDTO['paymentBalance'] = createInvoiceDTO['documentSum'];

    const newInvoice = new Invoice(createInvoiceDTO);

    return await this.invoiceRepository.save(newInvoice);
  }

  private async getTechnicalProcesses(createInvoiceDTO: CreateInvoiceDTO) {
    const productIds = getProductIdsFromProductLines(
      createInvoiceDTO.invoiceLines,
    );
    const productProcesses =
      await this.goodsService.getTechnicalProcessesFromProductIds(productIds);

    const serviceIds = getServiceIdsFromServiceLines(
      createInvoiceDTO.invoiceServiceLines,
    );
    const serviceProcesses =
      await this.goodsService.getTechnicalProcessesFromServiceIds(serviceIds);

    const technicalProcesses = [
      ...new Set([...productProcesses, ...serviceProcesses]),
    ];

    return technicalProcesses.map((process) => ({ id: process.id }));
  }
}
