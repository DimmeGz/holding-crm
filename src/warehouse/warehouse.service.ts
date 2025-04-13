import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { WarehouseAccounting } from './entities';
import {
  ChangeReceiveGoodsCountDTO,
  ChangeShipGoodsCountDTO,
  GetWareCostDTO,
  TransportProductsDTO,
} from './dto';

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
      .where('warehouseAccounting.qty != 0')
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

  async decreaseShipGoodsCount(decreaseGoodsCountDTO: ChangeShipGoodsCountDTO) {
    try {
      const warehouseAccounting = await this.warehouseAccountingRepository
        .createQueryBuilder('ware')
        .where('ware.companyId = :companyId', {
          companyId: decreaseGoodsCountDTO.companyId,
        })
        .andWhere('ware.warehouseId = :warehouseId', {
          warehouseId: decreaseGoodsCountDTO.warehouseId,
        })
        .andWhere('ware.batchId = :batchId', {
          batchId: decreaseGoodsCountDTO.batchId,
        })
        .andWhere('ware.packageId = :packageId', {
          packageId: decreaseGoodsCountDTO.packageId,
        })
        .getOneOrFail();

      warehouseAccounting.qty -= decreaseGoodsCountDTO.qty;
      await this.warehouseAccountingRepository.save(warehouseAccounting);
    } catch (e) {}
  }

  async returnShipGoodsCount(returnGoodsCountDTO: ChangeShipGoodsCountDTO) {
    try {
      const warehouseAccounting = await this.warehouseAccountingRepository
        .createQueryBuilder('ware')
        .where('ware.companyId = :companyId', {
          companyId: returnGoodsCountDTO.companyId,
        })
        .andWhere('ware.warehouseId = :warehouseId', {
          warehouseId: returnGoodsCountDTO.warehouseId,
        })
        .andWhere('ware.batchId = :batchId', {
          batchId: returnGoodsCountDTO.batchId,
        })
        .andWhere('ware.packageId = :packageId', {
          packageId: returnGoodsCountDTO.packageId,
        })
        .getOneOrFail();

      warehouseAccounting.qty += returnGoodsCountDTO.qty;
      await this.warehouseAccountingRepository.save(warehouseAccounting);
    } catch (e) {}
  }

  async increaseReceiveGoodsCount(
    increaseGoodsCountDTO: ChangeReceiveGoodsCountDTO,
  ) {
    try {
      let warehouseAccounting = await this.warehouseAccountingRepository
        .createQueryBuilder('ware')
        .where('ware.companyId = :companyId', {
          companyId: increaseGoodsCountDTO.companyId,
        })
        .andWhere('ware.warehouseId = :warehouseId', {
          warehouseId: increaseGoodsCountDTO.warehouseId,
        })
        .andWhere('ware.batchId = :batchId', {
          batchId: increaseGoodsCountDTO.batchId,
        })
        .andWhere('ware.packageId = :packageId', {
          packageId: increaseGoodsCountDTO.packageId,
        })
        .andWhere('ware.currencyId = :currencyId', {
          currencyId: increaseGoodsCountDTO.currencyId,
        })
        .getOne();

      if (warehouseAccounting) {
        const totalCost =
          warehouseAccounting.cost * warehouseAccounting.qty +
          increaseGoodsCountDTO.price * increaseGoodsCountDTO.qty;

        warehouseAccounting.qty += increaseGoodsCountDTO.qty;
        warehouseAccounting.cost = totalCost / warehouseAccounting.qty;
      } else {
        warehouseAccounting = new WarehouseAccounting({
          ...increaseGoodsCountDTO,
          cost: increaseGoodsCountDTO.price,
        });
      }

      await this.warehouseAccountingRepository.save(warehouseAccounting);
    } catch (e) {}
  }

  async returnReceiveGoodsCount(
    returnGoodsCountDTO: ChangeReceiveGoodsCountDTO,
  ) {
    try {
      const warehouseAccounting = await this.warehouseAccountingRepository
        .createQueryBuilder('ware')
        .where('ware.companyId = :companyId', {
          companyId: returnGoodsCountDTO.companyId,
        })
        .andWhere('ware.warehouseId = :warehouseId', {
          warehouseId: returnGoodsCountDTO.warehouseId,
        })
        .andWhere('ware.batchId = :batchId', {
          batchId: returnGoodsCountDTO.batchId,
        })
        .andWhere('ware.packageId = :packageId', {
          packageId: returnGoodsCountDTO.packageId,
        })
        .andWhere('ware.currencyId = :currencyId', {
          currencyId: returnGoodsCountDTO.currencyId,
        })
        .getOne();

      const newTotalCost =
        warehouseAccounting.cost * warehouseAccounting.qty -
        returnGoodsCountDTO.price * returnGoodsCountDTO.qty;

      warehouseAccounting.qty -= returnGoodsCountDTO.qty;

      if (!warehouseAccounting.qty) {
        await this.warehouseAccountingRepository.remove(warehouseAccounting);
      } else {
        warehouseAccounting.cost = newTotalCost / warehouseAccounting.qty;

        await this.warehouseAccountingRepository.save(warehouseAccounting);
      }
    } catch (e) {}
  }

  async transportProducts(transportDTO: TransportProductsDTO) {
    // TODO: add serviceLines to cost

    const linesToSave: WarehouseAccounting[] = [];
    for await (const line of transportDTO.transportLines) {
      const baseQueryBuilder = this.warehouseAccountingRepository
        .createQueryBuilder('ware')
        .where('ware.companyId = :companyId', {
          companyId: transportDTO.companyId,
        })
        .andWhere('ware.batchId = :batchId', { batchId: line.batchId })
        .andWhere('ware.packageId = :packageId', { packageId: line.packageId });

      const fromLine = await baseQueryBuilder
        .andWhere('ware.warehouseId = :warehouseId', {
          warehouseId: transportDTO.warehouseSenderId,
        })
        .getOne();

      if (!fromLine) {
        throw new NotFoundException('WarehouseAccounting not found');
      }

      let toLine = await baseQueryBuilder
        .andWhere('ware.warehouseId = :warehouseId', {
          warehouseId: transportDTO.warehouseReceiveId,
        })
        .getOne();

      fromLine.qty -= line.qty;
      linesToSave.push(fromLine);

      if (!toLine) {
        toLine = new WarehouseAccounting({
          companyId: transportDTO.companyId,
          batchId: line.batchId,
          packageId: line.packageId,
          warehouseId: transportDTO.warehouseReceiveId,
          qty: line.qty,
          cost: fromLine.cost,
          currencyId: fromLine.currencyId,
        });
      } else {
        toLine.qty += line.qty;
      }
      linesToSave.push(toLine);
    }

    await this.warehouseAccountingRepository.save(linesToSave);
  }

  async unTransportProducts(transportDTO: TransportProductsDTO) {
    // TODO: remove serviceLines to cost

    const linesToSave: WarehouseAccounting[] = [];
    for await (const line of transportDTO.transportLines) {
      const baseQueryBuilder = this.warehouseAccountingRepository
        .createQueryBuilder('ware')
        .where('ware.companyId = :companyId', {
          companyId: transportDTO.companyId,
        })
        .andWhere('ware.batchId = :batchId', { batchId: line.batchId })
        .andWhere('ware.packageId = :packageId', { packageId: line.packageId });

      const fromLine = await baseQueryBuilder
        .andWhere('ware.warehouseId = :warehouseId', {
          warehouseId: transportDTO.warehouseSenderId,
        })
        .getOne();

      const toLine = await baseQueryBuilder
        .andWhere('ware.warehouseId = :warehouseId', {
          warehouseId: transportDTO.warehouseReceiveId,
        })
        .getOne();

      if (!fromLine || !toLine) {
        throw new NotFoundException('WarehouseAccounting not found');
      }

      fromLine.qty += line.qty;
      toLine.qty -= line.qty;
      linesToSave.push(fromLine, toLine);
    }

    await this.warehouseAccountingRepository.save(linesToSave);
  }
}
