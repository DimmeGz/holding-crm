import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { ProductTransport } from './entities';

@Injectable()
export class ProductTransportService {
  constructor(
    @InjectRepository(ProductTransport)
    private readonly productTransportRepository: Repository<ProductTransport>,
  ) {}

  async getProductTransports() {
    const productTransports = await this.productTransportRepository
      .createQueryBuilder('productTransport')
      .leftJoin('productTransport.company', 'company')
      .leftJoin('productTransport.warehouseSender', 'warehouseSender')
      .leftJoin('productTransport.warehouseReceive', 'warehouseReceive')
      .orderBy('productTransport.id', 'DESC')
      .select([
        'productTransport.id',
        'productTransport.status',
        'productTransport.expectedDate',
        'company.name',
        'warehouseSender.name',
        'warehouseReceive.name',
      ])
      .getMany();

    return productTransports;
  }

  async getProductTransportById(productTransportId: number) {
    const productTransport = await this.productTransportRepository
      .createQueryBuilder('productTransport')
      .leftJoin('productTransport.company', 'company')
      .leftJoin('productTransport.warehouseSender', 'warehouseSender')
      .leftJoin('productTransport.warehouseReceive', 'warehouseReceive')
      .leftJoin(
        'productTransport.productTransportLines',
        'productTransportLine',
      )
      .leftJoin('productTransportLine.product', 'product')
      .leftJoin('productTransportLine.batch', 'batch')
      .leftJoin('productTransportLine.package', 'package')
      .where('productTransport.id = :productTransportId', {
        productTransportId,
      })
      .select([
        'productTransport.id',
        'productTransport.status',
        'productTransport.expectedDate',
        'productTransport.comment',
        'company.name',
        'warehouseSender.name',
        'warehouseReceive.name',
        'productTransportLine',
        'product.name',
        'batch.name',
        'package.name',
      ])
      .getOne();

    return productTransport;
  }
}
