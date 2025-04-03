import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Receive } from './entities';
import { Repository } from 'typeorm';

@Injectable()
export class ReceiveService {
  constructor(
    @InjectRepository(Receive)
    private readonly receivesRepository: Repository<Receive>,
  ) {}

  async getReceives() {
    const receives = await this.receivesRepository
      .createQueryBuilder('receive')
      .leftJoin('receive.seller', 'seller')
      .leftJoin('receive.buyer', 'buyer')
      .leftJoin('receive.shipment', 'shipment')
      .leftJoin('receive.currency', 'currency')
      .select([
        'receive.id',
        'receive.expectedDate',
        'receive.documentSum',
        'receive.status',
        'seller.name',
        'buyer.name',
        'shipment.id',
        'currency.name',
      ])
      .orderBy('receive.id', 'DESC')
      .getMany();

    return receives;
  }

  async getReceiveById(receiveId: number) {
    const receive = await this.receivesRepository
      .createQueryBuilder('receive')
      .leftJoin('receive.seller', 'seller')
      .leftJoin('receive.buyer', 'buyer')
      .leftJoin('receive.buyerWarehouse', 'buyerWarehouse')
      .leftJoin('receive.shipment', 'shipment')
      .leftJoin('shipment.invoice', 'invoice')
      .leftJoin('receive.currency', 'currency')
      .leftJoin('receive.receiveLines', 'receiveLine')
      .leftJoin('receiveLine.product', 'product')
      .leftJoin('receiveLine.batch', 'batch')
      .leftJoin('receiveLine.package', 'package')
      .where('receive.id = :receiveId', { receiveId })
      .select([
        'receive.id',
        'receive.expectedDate',
        'receive.documentSum',
        'receive.status',
        'receive.incoterms',
        'receive.transportPlace',
        'receive.transportAmount',
        'receive.comment',
        'seller.name',
        'buyer.name',
        'buyerWarehouse.name',
        'shipment.id',
        'invoice.id',
        'invoice.invoiceNumber',
        'currency.name',
        'receiveLine',
        'product.name',
        'batch.id',
        'batch.name',
        'package.name',
        'package.capacity',
      ])
      .getOne();

    return receive;
  }
}
