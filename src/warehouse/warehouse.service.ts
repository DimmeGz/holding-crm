import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { WarehouseAccounting } from './entities';
import { GetWareCostDTO } from './dto';

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

  async getWareCost(wareData: GetWareCostDTO): Promise<number> {
    try {
      const warehouseAccounting = await this.warehouseAccountingRepository
        .createQueryBuilder('warehouseAccounting')
        .andWhere('warehouseAccounting.batchId = :batchId', {
          batchId: wareData.batchId,
        })
        .andWhere('warehouseAccounting.packageId = :packageId', {
          packageId: wareData.packageId,
        })
        .andWhere('warehouseAccounting.warehouseId = :warehouseId', {
          warehouseId: wareData.warehouseId,
        })
        .andWhere('warehouseAccounting.companyId = :companyId', {
          companyId: wareData.companyId,
        })
        .andWhere('warehouseAccounting.currencyId = :currencyId', {
          currencyId: wareData.currencyId,
        })
        .getOneOrFail();

      if (warehouseAccounting.cost) {
        return warehouseAccounting.cost;
      } else {
        return 0;
      }
    } catch (e) {
      return 0;
    }
  }
}
