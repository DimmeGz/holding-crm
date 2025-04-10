import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { LibsService } from '../../libs';
import { ProductTransport } from './entities';
import { CreateProductTransportDTO } from './dto';

@Injectable()
export class ProductTransportService {
  constructor(
    @InjectRepository(ProductTransport)
    private readonly productTransportRepository: Repository<ProductTransport>,
    private readonly libsService: LibsService,
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

  async createProductTransport(
    createProductTransportDTO: CreateProductTransportDTO,
  ) {
    const newProductTransport = new ProductTransport(createProductTransportDTO);
    newProductTransport.status = false;
    newProductTransport.createdAt = new Date();
    newProductTransport.expectedDate =
      newProductTransport.expectedDate || newProductTransport.createdAt;
    newProductTransport.comment = newProductTransport.comment || '';

    const productIds = newProductTransport.productTransportLines.map(
      (line) => line.productId,
    );

    newProductTransport.technicalProcesses =
      await this.libsService.getTechnicalProcessesByProductIds([...productIds]);

    return await this.productTransportRepository.save(newProductTransport);
  }
}
