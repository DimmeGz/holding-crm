import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';

import { Warehouse, WarehouseAccounting } from './entities';
import {
  ChangeReceiveGoodsCountDTO,
  ChangeShipGoodsCountDTO,
  GetWareCostDTO,
  MakeProductionDTO,
  TransportProductsDTO,
} from './dto';
import { GetWarehouseQueryDTO } from './dto/query-dto';

@Injectable()
export class WarehouseService {
  constructor(
    @InjectRepository(WarehouseAccounting)
    private readonly warehouseAccountingRepository: Repository<WarehouseAccounting>,
    @InjectRepository(Warehouse)
    private readonly warehouseRepository: Repository<Warehouse>,
  ) {}

  private createBaseQueryBuilder(): SelectQueryBuilder<WarehouseAccounting> {
    return this.warehouseAccountingRepository
      .createQueryBuilder('warehouseAccounting')
      .where('warehouseAccounting.qty != 0');
  }

  private applyWarehouseAccountingListSelect(
    qb: SelectQueryBuilder<WarehouseAccounting>,
  ): SelectQueryBuilder<WarehouseAccounting> {
    return qb
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
      ]);
  }

  private applyQueryFilter(
    qb: SelectQueryBuilder<WarehouseAccounting>,
    query?: GetWarehouseQueryDTO,
  ) {
    if (query.company) {
      qb.andWhere('warehouseAccounting.companyId = :companyId', {
        companyId: query.company,
      });
    }

    if (query.warehouse) {
      qb.andWhere('warehouseAccounting.warehouseId = :warehouseId', {
        warehouseId: query.warehouse,
      });
    }

    if (query.process) {
      qb.leftJoin('product.technicalProcesses', 'process').andWhere(
        'process.id = :processId',
        { processId: query.process },
      );
    }

    return qb;
  }

  async getWarehouseAccountings(
    query?: GetWarehouseQueryDTO,
  ): Promise<WarehouseAccounting[]> {
    return await this.applyQueryFilter(
      this.applyWarehouseAccountingListSelect(this.createBaseQueryBuilder()),
      query,
    )
      .orderBy('product.name', 'ASC')
      .getMany();
  }

  async getWareCost(wareData: GetWareCostDTO): Promise<number> {
    const warehouseAccounting = await this.createBaseQueryBuilder()
      .where('warehouseAccounting.batchId = :batchId', {
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
      .getOne();

    return warehouseAccounting?.cost || 0;
  }

  private async changeGoodsCount(
    changeGoodsCountDTO: ChangeShipGoodsCountDTO | ChangeReceiveGoodsCountDTO,
    isIncrease: boolean,
  ): Promise<void> {
    const { companyId, warehouseId, batchId, packageId } = changeGoodsCountDTO;

    const queryBuilder = this.createBaseQueryBuilder()
      .where('warehouseAccounting.companyId = :companyId', { companyId })
      .andWhere('warehouseAccounting.warehouseId = :warehouseId', {
        warehouseId,
      })
      .andWhere('warehouseAccounting.batchId = :batchId', { batchId })
      .andWhere('warehouseAccounting.packageId = :packageId', { packageId });

    if ('currencyId' in changeGoodsCountDTO) {
      queryBuilder.andWhere('warehouseAccounting.currencyId = :currencyId', {
        currencyId: changeGoodsCountDTO.currencyId,
      });
    }

    const warehouseAccounting = await queryBuilder.getOne();

    if (!warehouseAccounting) {
      return;
    }

    if (isIncrease) {
      if ('price' in changeGoodsCountDTO) {
        const totalCost =
          warehouseAccounting.cost * warehouseAccounting.qty +
          changeGoodsCountDTO.price * changeGoodsCountDTO.qty;

        warehouseAccounting.qty += changeGoodsCountDTO.qty;
        warehouseAccounting.cost = totalCost / warehouseAccounting.qty;
      } else {
        warehouseAccounting.qty += changeGoodsCountDTO.qty;
      }
    } else {
      if ('price' in changeGoodsCountDTO) {
        const newTotalCost =
          warehouseAccounting.cost * warehouseAccounting.qty -
          changeGoodsCountDTO.price * changeGoodsCountDTO.qty;

        warehouseAccounting.qty -= changeGoodsCountDTO.qty;

        if (!warehouseAccounting.qty) {
          await this.warehouseAccountingRepository.remove(warehouseAccounting);
          return;
        }

        warehouseAccounting.cost = newTotalCost / warehouseAccounting.qty;
      } else {
        warehouseAccounting.qty -= changeGoodsCountDTO.qty;
      }
    }

    await this.warehouseAccountingRepository.save(warehouseAccounting);
  }

  async hasEnoughQty(params: {
    companyId: number;
    warehouseId: number;
    batchId: number;
    packageId: number;
    qty: number;
  }): Promise<boolean> {
    const { companyId, warehouseId, batchId, packageId, qty } = params;

    if (!batchId || !packageId) {
      return false;
    }

    const warehouseAccounting = await this.warehouseAccountingRepository.findOne(
      {
        where: { companyId, warehouseId, batchId, packageId },
      },
    );

    return (warehouseAccounting?.qty ?? 0) >= qty;
  }

  async decreaseShipGoodsCount(
    decreaseGoodsCountDTO: ChangeShipGoodsCountDTO,
  ): Promise<void> {
    await this.changeGoodsCount(decreaseGoodsCountDTO, false);
  }

  async returnShipGoodsCount(
    returnGoodsCountDTO: ChangeShipGoodsCountDTO,
  ): Promise<void> {
    await this.changeGoodsCount(returnGoodsCountDTO, true);
  }

  async increaseReceiveGoodsCount(
    increaseGoodsCountDTO: ChangeReceiveGoodsCountDTO,
  ): Promise<void> {
    let warehouseAccounting = await this.createBaseQueryBuilder()
      .where('warehouseAccounting.companyId = :companyId', {
        companyId: increaseGoodsCountDTO.companyId,
      })
      .andWhere('warehouseAccounting.warehouseId = :warehouseId', {
        warehouseId: increaseGoodsCountDTO.warehouseId,
      })
      .andWhere('warehouseAccounting.batchId = :batchId', {
        batchId: increaseGoodsCountDTO.batchId,
      })
      .andWhere('warehouseAccounting.packageId = :packageId', {
        packageId: increaseGoodsCountDTO.packageId,
      })
      .andWhere('warehouseAccounting.currencyId = :currencyId', {
        currencyId: increaseGoodsCountDTO.currencyId,
      })
      .getOne();

    if (!warehouseAccounting) {
      warehouseAccounting = new WarehouseAccounting(increaseGoodsCountDTO);
      warehouseAccounting.cost = increaseGoodsCountDTO.price;
      warehouseAccounting.qty = increaseGoodsCountDTO.qty;
    } else {
      await this.changeGoodsCount(increaseGoodsCountDTO, true);
      return;
    }

    await this.warehouseAccountingRepository.save(warehouseAccounting);
  }

  async returnReceiveGoodsCount(
    returnGoodsCountDTO: ChangeReceiveGoodsCountDTO,
  ): Promise<void> {
    await this.changeGoodsCount(returnGoodsCountDTO, false);
  }

  async transportProducts(transportDTO: TransportProductsDTO): Promise<void> {
    const linesToSave: WarehouseAccounting[] = [];

    const transportPromises = transportDTO.transportLines.map(async (line) => {
      const baseQueryBuilder = this.createBaseQueryBuilder()
        .where('warehouseAccounting.companyId = :companyId', {
          companyId: transportDTO.companyId,
        })
        .andWhere('warehouseAccounting.batchId = :batchId', {
          batchId: line.batchId,
        })
        .andWhere('warehouseAccounting.packageId = :packageId', {
          packageId: line.packageId,
        });

      const fromLine = await baseQueryBuilder
        .andWhere('warehouseAccounting.warehouseId = :warehouseId', {
          warehouseId: transportDTO.warehouseSenderId,
        })
        .getOne();

      if (!fromLine) {
        throw new NotFoundException('WarehouseAccounting not found');
      }

      let toLine = await baseQueryBuilder
        .andWhere('warehouseAccounting.warehouseId = :warehouseId', {
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
          cost: fromLine.cost + transportDTO.transportCost,
          currencyId: fromLine.currencyId,
        });
      } else {
        const totalCost = toLine.cost * toLine.qty + fromLine.cost * line.qty;
        toLine.qty += line.qty;
        toLine.cost = totalCost / toLine.qty + transportDTO.transportCost;
      }
      linesToSave.push(toLine);
    });

    await Promise.all(transportPromises);
    await this.warehouseAccountingRepository.save(linesToSave);
  }

  async unTransportProducts(transportDTO: TransportProductsDTO): Promise<void> {
    const linesToSave: WarehouseAccounting[] = [];

    const unTransportPromises = transportDTO.transportLines.map(
      async (line) => {
        const baseQueryBuilder = this.createBaseQueryBuilder()
          .where('warehouseAccounting.companyId = :companyId', {
            companyId: transportDTO.companyId,
          })
          .andWhere('warehouseAccounting.batchId = :batchId', {
            batchId: line.batchId,
          })
          .andWhere('warehouseAccounting.packageId = :packageId', {
            packageId: line.packageId,
          });

        const fromLine = await baseQueryBuilder
          .andWhere('warehouseAccounting.warehouseId = :warehouseId', {
            warehouseId: transportDTO.warehouseSenderId,
          })
          .getOne();

        const toLine = await baseQueryBuilder
          .andWhere('warehouseAccounting.warehouseId = :warehouseId', {
            warehouseId: transportDTO.warehouseReceiveId,
          })
          .getOne();

        if (!fromLine || !toLine) {
          throw new NotFoundException('WarehouseAccounting not found');
        }

        fromLine.qty += line.qty;
        toLine.qty -= line.qty;
        toLine.cost =
          (toLine.cost * toLine.qty -
            fromLine.cost * line.qty -
            transportDTO.transportCost * line.qty) /
          toLine.qty;

        linesToSave.push(fromLine, toLine);
      },
    );

    await Promise.all(unTransportPromises);
    await this.warehouseAccountingRepository.save(linesToSave);
  }

  async makeProduction(makeProductionDTO: MakeProductionDTO): Promise<void> {
    const linesToSave: WarehouseAccounting[] = [];

    const outLinePromises = makeProductionDTO.outLines.map(async (line) => {
      const outLine = await this.createBaseQueryBuilder()
        .where('warehouseAccounting.batchId = :batchId', {
          batchId: line.batchId,
        })
        .andWhere('warehouseAccounting.packageId = :packageId', {
          packageId: line.packageId,
        })
        .andWhere('warehouseAccounting.companyId = :companyId', {
          companyId: makeProductionDTO.companyId,
        })
        .andWhere('warehouseAccounting.warehouseId = :warehouseId', {
          warehouseId: makeProductionDTO.warehouseId,
        })
        .getOne();

      if (!outLine) {
        throw new NotFoundException('WarehouseAccounting not found');
      }

      outLine.qty += makeProductionDTO.status ? -line.qty : line.qty;
      return outLine;
    });

    const inLinePromises = makeProductionDTO.inLines.map(async (line) => {
      let inLine = await this.createBaseQueryBuilder()
        .where('warehouseAccounting.batchId = :batchId', {
          batchId: line.batchId,
        })
        .andWhere('warehouseAccounting.packageId = :packageId', {
          packageId: line.packageId,
        })
        .andWhere('warehouseAccounting.companyId = :companyId', {
          companyId: makeProductionDTO.companyId,
        })
        .andWhere('warehouseAccounting.warehouseId = :warehouseId', {
          warehouseId: makeProductionDTO.warehouseId,
        })
        .getOne();

      if (!inLine) {
        inLine = new WarehouseAccounting({
          ...line,
          companyId: makeProductionDTO.companyId,
          warehouseId: makeProductionDTO.warehouseId,
        });
      }

      inLine.qty += makeProductionDTO.status ? line.qty : -line.qty;
      return inLine;
    });

    const [outLines, inLines] = await Promise.all([
      Promise.all(outLinePromises),
      Promise.all(inLinePromises),
    ]);

    linesToSave.push(...outLines, ...inLines);

    await this.warehouseAccountingRepository.save(linesToSave);
  }

  async getStoreData() {
    return await this.warehouseRepository
      .createQueryBuilder('warehouse')
      .select(['warehouse.id', 'warehouse.name'])
      .getMany();
  }
}
