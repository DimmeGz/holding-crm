import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, QueryFailedError, Repository } from 'typeorm';

import { Batch } from './entities/batch.entity';
import { BatchCustomField } from './entities/batch-custom-field.entity';
import { Product } from './entities/product.entity';
import { CreateBatchDTO } from './dto/create-batch.dto';
import { UpdateBatchDTO } from './dto/update-batch.dto';
import { BatchesListGroupDTO } from './dto/get-batches-list-response.dto';
import { GetBatchDetailResponseDTO } from './dto/get-batch-detail-response.dto';

type BatchListRawRow = {
  productId: number;
  productName: string;
  batchId: number;
  batchName: string;
  hasCustomFields: number | boolean | string;
};

@Injectable()
export class BatchesService {
  constructor(
    @InjectRepository(Batch)
    private readonly batchesRepository: Repository<Batch>,
    @InjectRepository(BatchCustomField)
    private readonly batchCustomFieldsRepository: Repository<BatchCustomField>,
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  async getBatchesList(processId?: number): Promise<BatchesListGroupDTO[]> {
    const qb = this.batchesRepository
      .createQueryBuilder('batch')
      .innerJoin('batch.product', 'product')
      .select('product.id', 'productId')
      .addSelect('product.name', 'productName')
      .addSelect('batch.id', 'batchId')
      .addSelect('batch.name', 'batchName')
      .addSelect(
        `EXISTS (
          SELECT 1
          FROM warehouse_batchescustomfields bcf
          WHERE bcf.batch_id = batch.id
        )`,
        'hasCustomFields',
      )
      .where('batch.isArchived = :archived', { archived: false })
      .orderBy('product.name', 'ASC')
      .addOrderBy('batch.name', 'ASC');

    if (processId) {
      qb.innerJoin(
        'product.technicalProcesses',
        'technicalProcess',
        'technicalProcess.id = :processId',
        { processId },
      );
    }

    const rows = await qb.getRawMany<BatchListRawRow>();
    const groups = new Map<number, BatchesListGroupDTO>();

    for (const row of rows) {
      const productId = Number(row.productId);
      let group = groups.get(productId);

      if (!group) {
        group = {
          product: {
            id: productId,
            name: row.productName,
          },
          batches: [],
        };
        groups.set(productId, group);
      }

      group.batches.push({
        id: Number(row.batchId),
        name: row.batchName,
        hasCustomFields: Boolean(Number(row.hasCustomFields)),
      });
    }

    return Array.from(groups.values());
  }

  async getBatchDetail(batchId: number): Promise<GetBatchDetailResponseDTO> {
    const batch = await this.batchesRepository.findOne({
      where: { id: batchId },
      relations: ['product', 'product.customFields', 'customFields'],
    });

    if (!batch) {
      throw new NotFoundException(`Batch with id: ${batchId} not found`);
    }

    const valuesByFieldId = new Map(
      (batch.customFields ?? []).map((field) => [
        field.customFieldId,
        field.value ?? null,
      ]),
    );

    const customFields = [...(batch.product.customFields ?? [])]
      .sort((a, b) => {
        if (a.priority !== b.priority) {
          return a.priority - b.priority;
        }
        return a.id - b.id;
      })
      .map((field) => ({
        id: field.id,
        name: field.name,
        description: field.description ?? null,
        defaultValue: field.defaultValue ?? null,
        unit: field.unit ?? null,
        priority: field.priority,
        value: valuesByFieldId.get(field.id) ?? null,
      }));

    return {
      id: batch.id,
      name: batch.name,
      productId: batch.productId,
      product: {
        id: batch.product.id,
        name: batch.product.name,
      },
      countryOfOriginId: batch.countryOfOriginId,
      customFields,
    };
  }

  async createBatch(dto: CreateBatchDTO): Promise<Batch> {
    const product = await this.productsRepository.findOne({
      where: { id: dto.productId },
      select: { id: true },
    });

    if (!product) {
      throw new NotFoundException(`Product with id: ${dto.productId} not found`);
    }

    await this.ensureUniqueName(dto.name);

    try {
      const batch = this.batchesRepository.create({
        productId: dto.productId,
        name: dto.name.trim(),
        countryOfOriginId:
          dto.countryOfOriginId === undefined ? null : dto.countryOfOriginId,
        isArchived: false,
      });

      return await this.batchesRepository.save(batch);
    } catch (error) {
      this.rethrowUniqueNameConflict(error, dto.name);
      throw error;
    }
  }

  async updateBatch(batchId: number, dto: UpdateBatchDTO): Promise<Batch> {
    const batch = await this.batchesRepository.findOne({
      where: { id: batchId },
    });

    if (!batch) {
      throw new NotFoundException(`Batch with id: ${batchId} not found`);
    }

    if (dto.productId !== undefined && dto.productId !== batch.productId) {
      const product = await this.productsRepository.findOne({
        where: { id: dto.productId },
        select: { id: true },
      });

      if (!product) {
        throw new NotFoundException(
          `Product with id: ${dto.productId} not found`,
        );
      }

      batch.productId = dto.productId;
    }

    if (dto.name !== undefined && dto.name.trim() !== batch.name) {
      await this.ensureUniqueName(dto.name, batchId);
      batch.name = dto.name.trim();
    }

    if (dto.countryOfOriginId !== undefined) {
      batch.countryOfOriginId = dto.countryOfOriginId;
    }

    try {
      await this.batchesRepository.save(batch);
    } catch (error) {
      this.rethrowUniqueNameConflict(error, dto.name ?? batch.name);
      throw error;
    }

    // Modal edit omits customFields → leave existing values untouched.
    // Update page sends the full product custom-field set → upsert.
    if (dto.customFields !== undefined) {
      await this.syncCustomFields(batch.id, batch.productId, dto.customFields);
    }

    return this.batchesRepository.findOneOrFail({ where: { id: batchId } });
  }

  private async syncCustomFields(
    batchId: number,
    productId: number,
    customFields: NonNullable<UpdateBatchDTO['customFields']>,
  ): Promise<void> {
    const product = await this.productsRepository.findOne({
      where: { id: productId },
      relations: ['customFields'],
    });

    if (!product) {
      throw new NotFoundException(`Product with id: ${productId} not found`);
    }

    const allowedFieldIds = new Set(
      (product.customFields ?? []).map((field) => field.id),
    );

    for (const item of customFields) {
      if (!allowedFieldIds.has(item.customFieldId)) {
        throw new BadRequestException(
          `Custom field ${item.customFieldId} is not available for product ${productId}`,
        );
      }
    }

    const existing = await this.batchCustomFieldsRepository.find({
      where: {
        batchId,
        customFieldId: In(customFields.map((item) => item.customFieldId)),
      },
    });
    const existingByFieldId = new Map(
      existing.map((row) => [row.customFieldId, row]),
    );

    const toSave = customFields.map((item) => {
      const current = existingByFieldId.get(item.customFieldId);
      const value = item.value ?? null;

      if (current) {
        current.value = value;
        return current;
      }

      return this.batchCustomFieldsRepository.create({
        batchId,
        customFieldId: item.customFieldId,
        value,
      });
    });

    if (toSave.length > 0) {
      await this.batchCustomFieldsRepository.save(toSave);
    }
  }

  private async ensureUniqueName(
    name: string,
    excludeId?: number,
  ): Promise<void> {
    const existing = await this.batchesRepository.findOne({
      where: { name: name.trim() },
      select: { id: true },
    });

    if (existing && existing.id !== excludeId) {
      throw new ConflictException(`Batch name "${name.trim()}" already exists`);
    }
  }

  private rethrowUniqueNameConflict(error: unknown, name: string): void {
    const code = this.getDbErrorCode(error);

    // PostgreSQL unique_violation
    if (code === '23505') {
      throw new ConflictException(`Batch name "${name.trim()}" already exists`);
    }
  }

  private getDbErrorCode(error: unknown): string {
    if (error instanceof QueryFailedError) {
      const withDriver = error as QueryFailedError & {
        driverError?: { code?: string };
        code?: string;
      };
      return String(withDriver.driverError?.code ?? withDriver.code ?? '');
    }

    if (typeof error === 'object' && error !== null && 'code' in error) {
      return String((error as { code?: string }).code ?? '');
    }

    return '';
  }
}
