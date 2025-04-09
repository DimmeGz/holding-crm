import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Shipment, ShipmentLine } from './entities';
import { ReceiveService } from '../receive/receive.service';
import { CreateShipmentDTO } from './dto/create-shipment.dto';
import {
  getProductIdsFromProductLines,
  getServiceIdsFromServiceLines,
} from '../../common/utils';
import { GoodsService } from '../../goods';

@Injectable()
export class ShipmentService {
  constructor(
    @InjectRepository(Shipment)
    private readonly shipmentsRepository: Repository<Shipment>,
    @InjectRepository(ShipmentLine)
    private readonly shipmentLinessRepository: Repository<ShipmentLine>,
    private readonly goodsService: GoodsService,
    private readonly receiveService: ReceiveService,
  ) {}

  async getShipments() {
    const shipments = await this.shipmentsRepository
      .createQueryBuilder('shipment')
      .leftJoin('shipment.seller', 'seller')
      .leftJoin('shipment.buyer', 'buyer')
      .leftJoin('shipment.invoice', 'invoice')
      .leftJoin('shipment.currency', 'currency')
      .leftJoin('shipment.sellerWarehouse', 'sellerWarehouse')
      .select([
        'shipment.id',
        'shipment.status',
        'shipment.documentSum',
        'shipment.expectedDate',
        'seller.name',
        'sellerWarehouse.name',
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

    const receives =
      await this.receiveService.getReceivesByShipmentId(shipmentId);

    return { shipment, receives };
  }

  async getShippedProductsByContract(
    contractId: number,
  ): Promise<{ number?: number }> {
    const shippedLines = await this.shipmentLinessRepository
      .createQueryBuilder('shipmentLine')
      .leftJoin('shipmentLine.shipment', 'shipment')
      .where('shipment.status = TRUE')
      .leftJoin('shipment.invoice', 'invoice')
      .leftJoin('invoice.invoiceLines', 'invoiceLine')
      .leftJoin('invoiceLine.order', 'order')
      .leftJoin('order.contract', 'contract')
      .andWhere('contract.id = :contractId', { contractId })
      .leftJoin('shipmentLine.product', 'product')
      .select(['shipmentLine.id', 'shipmentLine.qty', 'product.id'])
      .getMany();

    const res = shippedLines.reduce((acc, { product: { id }, qty }) => {
      acc[id] = (acc[id] || 0) + qty;
      return acc;
    }, {});

    return res;
  }

  async getShipmentsByInvoiceId(invoiceId: number) {
    const shipments = await this.shipmentsRepository
      .createQueryBuilder('shipment')
      .where('shipment.invoiceId = :invoiceId', { invoiceId })
      .select(['shipment.id', 'shipment.status'])
      .orderBy('shipment.id', 'ASC')
      .getMany();

    for await (const shipment of shipments) {
      shipment['receives'] = await this.receiveService.getReceivesByShipmentId(
        shipment.id,
      );
    }

    return shipments;
  }

  async createShipment(createShipmentDTO: CreateShipmentDTO) {
    createShipmentDTO['technicalProcesses'] =
      await this.getTechnicalProcesses(createShipmentDTO);

    const newShipment = new Shipment(createShipmentDTO);
    newShipment.createdAt = new Date();
    newShipment.comment = newShipment.comment || '';
    newShipment.transportPlace = newShipment.transportPlace || '';
    newShipment.status = false;

    newShipment.documentSum =
      newShipment.shipmentLines.reduce(
        (acc, cur) => (acc += cur.price * cur.qty),
        0,
      ) +
      newShipment.shipmentLines.reduce(
        (acc, cur) => (acc += cur.price * cur.qty),
        0,
      );

    return await this.shipmentsRepository.save(newShipment);
  }

  private async getTechnicalProcesses(createShipmentDTO: CreateShipmentDTO) {
    const productIds = getProductIdsFromProductLines(
      createShipmentDTO.shipmentLines,
    );
    const productProcesses =
      await this.goodsService.getTechnicalProcessesFromProductIds(productIds);

    const serviceIds = getServiceIdsFromServiceLines(
      createShipmentDTO.shipmentServiceLines,
    );
    const serviceProcesses =
      await this.goodsService.getTechnicalProcessesFromServiceIds(serviceIds);

    const technicalProcesses = [
      ...new Set([...productProcesses, ...serviceProcesses]),
    ];

    return technicalProcesses.map((process) => ({ id: process.id }));
  }
}
