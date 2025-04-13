import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { LibsService } from '../../libs';

import { Production } from './entities';
import { CreateProductionDTO, UpdateProductionDTO } from './dto';
import { WarehouseService } from '../../warehouse';

@Injectable()
export class ProductionService {
  constructor(
    @InjectRepository(Production)
    private readonly productionsRepository: Repository<Production>,
    @InjectDataSource() private dataSource: DataSource,
    private readonly libsService: LibsService,
    private readonly warehouseService: WarehouseService,
  ) {}

  async getProductions(): Promise<Production[]> {
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

  async getProductionById(productionId: number): Promise<Production> {
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

  async createProduction(
    createProductionDTO: CreateProductionDTO,
  ): Promise<Production> {
    createProductionDTO['createdAt'] = new Date();
    const newProduction = new Production(createProductionDTO);
    newProduction.status = false;
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
    const production = await this.productionsRepository
      .createQueryBuilder('production')
      .leftJoinAndSelect('production.productionInLines', 'productionInLine')
      .leftJoinAndSelect('production.productionOutLines', 'productionOutLine')
      .where('production.id = :productionId', { productionId })
      .getOne();

    const updatedInLinesIds = [];
    for (const line of updateProductionDTO.productionInLines) {
      if (line['id']) {
        updatedInLinesIds.push(line['id']);
      }
    }
    const inLinesToDelete = production.productionInLines.filter(
      (line) => !updatedInLinesIds.includes(line.id),
    );

    const updatedOutLinesIds = [];
    for (const line of production.productionOutLines) {
      if (line['id']) {
        updatedOutLinesIds.push(line['id']);
      }
    }
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
    try {
      const production = await this.productionsRepository.findOneByOrFail({
        id: productionId,
        status: false,
      });

      return await this.productionsRepository.remove(production);
    } catch (e) {
      throw new NotFoundException(e);
    }
  }

  async changeProductionStatus(productionId: number): Promise<Production> {
    const production = await this.productionsRepository.findOne({
      where: {
        id: productionId,
      },
      relations: ['productionOutLines', 'productionInLines'],
    });

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
