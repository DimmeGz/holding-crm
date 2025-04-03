import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Production } from './entities';
import { Repository } from 'typeorm';

@Injectable()
export class ProductionService {
  constructor(
    @InjectRepository(Production)
    private readonly productionsRepository: Repository<Production>,
  ) {}

  async getProductions() {
    const productions = await this.productionsRepository
      .createQueryBuilder('production')
      .leftJoin('production.company', 'company')
      .leftJoin('production.warehouse', 'warehouse')
      .leftJoin('production.productionInLines', 'productionInLine')
      .leftJoin('productionInLine.product', 'product')
      .select([
        'production.id',
        'production.status',
        'production.expectedDate',
        'company.name',
        'warehouse.name',
        'productionInLine.id',
        'product.name',
      ])
      .orderBy('production.id', 'DESC')
      .getMany();

    return productions;
  }

  async getProductionById(productionId: number) {
    const production = await this.productionsRepository
      .createQueryBuilder('production')
      .leftJoin('production.company', 'company')
      .leftJoin('production.warehouse', 'warehouse')
      .leftJoin('production.productionOutLines', 'productionOutLine')
      .leftJoin('productionOutLine.product', 'outProduct')
      .leftJoin('productionOutLine.batch', 'outBatch')
      .leftJoin('productionOutLine.package', 'outPackage')
      .leftJoin('production.productionInLines', 'productionInLine')
      .leftJoin('productionInLine.product', 'inProduct')
      .leftJoin('productionInLine.batch', 'inBatch')
      .leftJoin('productionInLine.package', 'inPackage')
      .select([
        'production.id',
        'production.status',
        'production.expectedDate',
        'production.comment',
        'company.name',
        'warehouse.name',
        'productionOutLine',
        'outProduct.id',
        'outProduct.name',
        'outBatch.id',
        'outBatch.name',
        'outPackage.name',
        'productionInLine',
        'inProduct.id',
        'inProduct.name',
        'inBatch.id',
        'inBatch.name',
        'inPackage.name',
      ])
      .where('production.id = :productionId', { productionId })
      .getOne();

    return production;
  }
}
