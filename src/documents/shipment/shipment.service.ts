import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Shipment } from './entities';

@Injectable()
export class ShipmentService {
  constructor(
    @InjectRepository(Shipment)
    private readonly shipmentsRepository: Repository<Shipment>,
  ) {}

  async getShipments() {
    const shipments = await this.shipmentsRepository
      .createQueryBuilder('shipment')
      .leftJoin('shipment.seller', 'seller')
      .leftJoin('shipment.buyer', 'buyer')
      .leftJoin('shipment.invoice', 'invoice')
      .leftJoin('shipment.currency', 'currency')
      .select([
        'shipment.id',
        'shipment.status',
        'shipment.documentSum',
        'shipment.expectedDate',
        'seller.name',
        'buyer.name',
        'invoice.invoiceNumber',
        'currency.name',
      ])
      .orderBy('shipment.id', 'DESC')
      .getMany();

    return shipments;
  }

  async getShipmentById(shipmentId: number) {
    const shipment = await this.shipmentsRepository
      .createQueryBuilder('shipment')
      .leftJoin('shipment.seller', 'seller')
      .leftJoin('shipment.buyer', 'buyer')
      .leftJoin('shipment.invoice', 'invoice')
      .leftJoin('shipment.currency', 'currency')
      .leftJoin('shipment.shipmentLines', 'shipmentLine')
      .leftJoin('shipmentLine.product', 'product')
      .leftJoin('shipmentLine.batch', 'batch')
      .leftJoin('shipmentLine.package', 'package')
      .select([
        'shipment.id',
        'shipment.status',
        'shipment.documentSum',
        'shipment.expectedDate',
        'shipment.incoterms',
        'shipment.transportPlace',
        'shipment.transportAmount',
        'shipment.comment',
        'seller.name',
        'buyer.name',
        'invoice.id',
        'invoice.invoiceNumber',
        'currency.name',
        'shipmentLine',
        'product.name',
        'batch.id',
        'batch.name',
        'package.name',
        'package.capacity',
      ])
      .where('shipment.id = :shipmentId', { shipmentId })
      .getOne();

    return shipment;
  }
}
