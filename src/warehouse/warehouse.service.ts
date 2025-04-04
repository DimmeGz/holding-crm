import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WarehouseAccounting } from './entities';
import { Repository } from 'typeorm';

@Injectable()
export class WarehouseService {
  constructor(
    @InjectRepository(WarehouseAccounting)
    private readonly warehouseAccountingRepository: Repository<WarehouseAccounting>,
  ) {}

  async getWarehouseAccounting() {
    const warehouseAccounting = await this.warehouseAccountingRepository
      .createQueryBuilder('warehouseAccounting')
      .leftJoin('warehouseAccounting.batch', 'batch')
      .leftJoin('batch.product', 'product')
      .leftJoin('warehouseAccounting.package', 'package')
      .leftJoin('warehouseAccounting.warehouse', 'warehouse')
      .leftJoin('warehouseAccounting.company', 'company')
      .leftJoin('warehouseAccounting.currency', 'currency')
      .select([
        'warehouseAccounting.id',
        'warehouseAccounting.qty',
        'warehouseAccounting.cost',
        'product.id',
        'product.name',
        'batch.id',
        'batch.name',
        'package.name',
        'warehouse.id',
        'warehouse.name',
        'company.id',
        'company.name',
        'currency.name',
      ])
      .orderBy('product.name', 'ASC')
      .getMany();

    return warehouseAccounting;
  }
}
