import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';

import { LibsService } from '../../libs';
import { WarehouseService } from '../../warehouse';

import { Production } from './entities';
import { CreateProductionDTO, UpdateProductionDTO } from './dto';

@Injectable()
export class ProductionService {
  constructor(
    @InjectRepository(Production)
    private readonly productionsRepository: Repository<Production>,
    @InjectDataSource() private dataSource: DataSource,
    private readonly libsService: LibsService,
    private readonly warehouseService: WarehouseService,
  ) {}

  private createBaseQueryBuilder(): SelectQueryBuilder<Production> {
    return this.productionsRepository.createQueryBuilder('production');
  }

  private applyProductionListSelect(
    qb: SelectQueryBuilder<Production>,
  ): SelectQueryBuilder<Production> {
    return qb
      .leftJoin('production.company', 'company')
      .leftJoin('production.warehouse', 'warehouse')
      .leftJoin('production.productionOutLines', 'productionOutLine')
      .select([
        'production.id',
        'production.status',
        'production.expectedDate',
        'company.name',
        'warehouse.name',
        'productionOutLine.id',
        'productionOutLine.productId',
      ]);
  }

  private applyProductionDetailSelect(
    qb: SelectQueryBuilder<Production>,
  ): SelectQueryBuilder<Production> {
    return qb
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
      ]);
  }

  async getProductions(): Promise<Production[]> {
    return await this.applyProductionListSelect(this.createBaseQueryBuilder())
      .orderBy('production.id', 'DESC')
      .getMany();
  }

  async getProductionById(productionId: number): Promise<Production> {
    const production = await this.applyProductionDetailSelect(
      this.createBaseQueryBuilder(),
    )
      .where('production.id = :productionId', { productionId })
      .getOne();

    if (!production) {
      throw new NotFoundException(
        `Production with id: ${productionId} not found`,
      );
    }

    return production;
  }

  async createProduction(
    createProductionDTO: CreateProductionDTO,
  ): Promise<Production> {
    const newProduction =
      this.productionsRepository.create(createProductionDTO);
    newProduction.status = false;
    newProduction.createdAt = new Date();
    newProduction.expectedDate =
      newProduction.expectedDate || newProduction.createdAt;
    newProduction.comment = newProduction.comment || '';

    const productIds = new Set([
      ...newProduction.productionInLines.map((line) => line.productId),
      ...newProduction.productionOutLines.map((line) => line.productId),
    ]);

    newProduction.technicalProcesses =
      await this.libsService.getTechnicalProcessesByProductIds([...productIds]);

    return await this.productionsRepository.save(newProduction);
  }

  async updateProduction(
    productionId: number,
    updateProductionDTO: UpdateProductionDTO,
  ): Promise<Production> {
    const production = await this.createBaseQueryBuilder()
      .where('production.id = :productionId', { productionId })
      .leftJoinAndSelect('production.productionInLines', 'productionInLine')
      .leftJoinAndSelect('production.productionOutLines', 'productionOutLine')
      .getOne();

    if (!production) {
      throw new NotFoundException(
        `Production with id: ${productionId} not found`,
      );
    }

    const updatedInLinesIds = updateProductionDTO.productionInLines
      .filter((line) => line['id'])
      .map((line) => line['id']);
    const inLinesToDelete = production.productionInLines.filter(
      (line) => !updatedInLinesIds.includes(line.id),
    );

    const updatedOutLinesIds = updateProductionDTO.productionOutLines
      .filter((line) => line['id'])
      .map((line) => line['id']);
    const outLinesToDelete = production.productionOutLines.filter(
      (line) => !updatedOutLinesIds.includes(line.id),
    );

    const updated = Object.assign(production, updateProductionDTO);

    const productIds = new Set([
      ...updated.productionInLines.map((line) => line.productId),
      ...updated.productionOutLines.map((line) => line.productId),
    ]);

    updated.technicalProcesses =
      await this.libsService.getTechnicalProcessesByProductIds([...productIds]);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (inLinesToDelete.length) {
        await queryRunner.manager.remove(inLinesToDelete);
      }

      if (outLinesToDelete.length) {
        await queryRunner.manager.remove(outLinesToDelete);
      }

      await queryRunner.manager.save(updated);

      await queryRunner.commitTransaction();

      return updated;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException();
    } finally {
      await queryRunner.release();
    }
  }

  async removeProduction(productionId: number): Promise<Production> {
    const production = await this.productionsRepository.findOne({
      where: { id: productionId, status: false },
      relations: ['productionInLines', 'productionOutLines'],
    });

    if (!production) {
      throw new NotFoundException(
        `Production with id: ${productionId} and status: false not found`,
      );
    }

    return await this.productionsRepository.remove(production);
  }

  async changeProductionStatus(productionId: number): Promise<Production> {
    const production = await this.productionsRepository.findOne({
      where: {
        id: productionId,
      },
      relations: ['productionOutLines', 'productionInLines'],
    });

    if (!production) {
      throw new NotFoundException(
        `Production with id: ${productionId} not found`,
      );
    }

    production.status = !production.status;

    await this.warehouseService.makeProduction({
      companyId: production.companyId,
      warehouseId: production.warehouseId,
      status: production.status,
      outLines: production.productionOutLines,
      inLines: production.productionInLines,
    });

    return await this.productionsRepository.save(production);
  }
}
