import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';

import { LibsService } from '../../libs';
import { WarehouseService } from '../../warehouse';

import { ProductTransport } from './entities';
import { CreateProductTransportDTO, UpdateProductTransportDTO } from './dto';

@Injectable()
export class ProductTransportService {
  constructor(
    @InjectRepository(ProductTransport)
    private readonly productTransportRepository: Repository<ProductTransport>,
    @InjectDataSource() private dataSource: DataSource,
    private readonly libsService: LibsService,
    private readonly warehouseService: WarehouseService,
  ) { }

  private createBaseQueryBuilder(): SelectQueryBuilder<ProductTransport> {
    return this.productTransportRepository.createQueryBuilder(
      'productTransport',
    );
  }

  private applyProductTransportListSelect(
    qb: SelectQueryBuilder<ProductTransport>,
  ): SelectQueryBuilder<ProductTransport> {
    return qb
      .select([
        'productTransport.id',
        'productTransport.status',
        'productTransport.expectedDate',
        'productTransport.warehouseSenderId',
        'productTransport.warehouseReceiveId',
        'productTransport.companyId'
      ]);
  }

  private applyProductTransportDetailSelect(
    qb: SelectQueryBuilder<ProductTransport>,
  ): SelectQueryBuilder<ProductTransport> {
    return qb
      .leftJoin('productTransport.company', 'company')
      .leftJoin('productTransport.warehouseSender', 'warehouseSender')
      .leftJoin('productTransport.warehouseReceive', 'warehouseReceive')
      .leftJoin(
        'productTransport.productTransportLines',
        'productTransportLine',
      )
      .leftJoin(
        'productTransport.productTransportServiceLines',
        'productTransportServiceLine',
      )
      .leftJoin('productTransportLine.product', 'product')
      .leftJoin('productTransportLine.batch', 'batch')
      .leftJoin('productTransportLine.package', 'package')
      .select([
        'productTransport.id',
        'productTransport.status',
        'productTransport.expectedDate',
        'productTransport.comment',
        'company.name',
        'warehouseSender.name',
        'warehouseReceive.name',
        'productTransportLine',
        'productTransportServiceLine.id',
        'productTransportServiceLine.serviceId',
        'productTransportServiceLine.qty',
        'productTransportServiceLine.price',
        'product.name',
        'batch.name',
        'package.name',
      ]);
  }

  async getProductTransports(): Promise<ProductTransport[]> {
    return await this.applyProductTransportListSelect(
      this.createBaseQueryBuilder(),
    )
      .orderBy('productTransport.id', 'DESC')
      .getMany();
  }

  async getProductTransportById(
    productTransportId: number,
  ): Promise<ProductTransport> {
    const productTransport = await this.applyProductTransportDetailSelect(
      this.createBaseQueryBuilder(),
    )
      .where('productTransport.id = :productTransportId', {
        productTransportId,
      })
      .getOne();

    if (!productTransport) {
      throw new NotFoundException(
        `Product transport with id: ${productTransportId} not found`,
      );
    }

    return productTransport;
  }

  async createProductTransport(
    createTransportDTO: CreateProductTransportDTO,
  ): Promise<ProductTransport> {
    const newTransport =
      this.productTransportRepository.create(createTransportDTO);
    newTransport.status = false;
    newTransport.createdAt = new Date();
    newTransport.expectedDate =
      newTransport.expectedDate || newTransport.createdAt;
    newTransport.comment = newTransport.comment || '';

    const productIds = newTransport.productTransportLines.map(
      (line) => line.productId,
    );

    newTransport.technicalProcesses =
      await this.libsService.getTechnicalProcessesByProductIds([...productIds]);

    return await this.productTransportRepository.save(newTransport);
  }

  async updateProductTransport(
    productTransportId: number,
    updateTransportDTO: UpdateProductTransportDTO,
  ): Promise<ProductTransport> {
    const transport = await this.createBaseQueryBuilder()
      .where('productTransport.id = :productTransportId', {
        productTransportId,
      })
      .andWhere('productTransport.status = FALSE')
      .leftJoinAndSelect(
        'productTransport.productTransportLines',
        'productTransportLines',
      )
      .leftJoinAndSelect(
        'productTransport.productTransportServiceLines',
        'productTransportServiceLines',
      )
      .leftJoinAndSelect(
        'productTransport.technicalProcesses',
        'technicalProcesses',
      )
      .getOne();

    if (!transport) {
      throw new NotFoundException(
        `Product transport with id: ${productTransportId} and status: false not found`,
      );
    }

    const updatedTransportLinesIds = updateTransportDTO.productTransportLines
      .filter((line) => line['id'])
      .map((line) => line['id']);
    const transportLinesToDelete = transport.productTransportLines.filter(
      (line) => !updatedTransportLinesIds.includes(line.id),
    );

    const updatedTransportServiceLinesIds =
      updateTransportDTO.productTransportServiceLines
        .filter((line) => line['id'])
        .map((line) => line['id']);
    const transportServiceLinesToDelete =
      transport.productTransportServiceLines.filter(
        (line) => !updatedTransportServiceLinesIds.includes(line.id),
      );

    const updated = Object.assign(transport, updateTransportDTO);

    const productIds = updated.productTransportLines.map(
      (line) => line.productId,
    );

    updated.technicalProcesses =
      await this.libsService.getTechnicalProcessesByProductIds([...productIds]);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (transportLinesToDelete.length) {
        await queryRunner.manager.remove(transportLinesToDelete);
      }

      if (transportServiceLinesToDelete.length) {
        await queryRunner.manager.remove(transportServiceLinesToDelete);
      }

      await queryRunner.manager.save(updated);

      await queryRunner.commitTransaction();

      return updated;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(e);
    } finally {
      await queryRunner.release();
    }
  }

  async removeProductTransport(
    productTransportId: number,
  ): Promise<ProductTransport> {
    const transport = await this.productTransportRepository.findOne({
      where: { id: productTransportId, status: false },
      relations: ['productTransportLines', 'productTransportServiceLines'],
    });

    if (!transport) {
      throw new NotFoundException(
        `Product transport with id: ${productTransportId} and status: false not found`,
      );
    }

    return await this.productTransportRepository.remove(transport);
  }

  async changeProductTransportStatus(
    productTransportId: number,
  ): Promise<ProductTransport> {
    const transport = await this.productTransportRepository.findOne({
      where: { id: productTransportId },
      relations: ['productTransportLines', 'productTransportServiceLines'],
    });

    if (!transport) {
      throw new NotFoundException(
        `Product transport with id: ${productTransportId} not found`,
      );
    }

    transport.status = !transport.status;

    await this.updateWarehouseAccounting(transport);

    return await this.productTransportRepository.save(transport);
  }

  private async updateWarehouseAccounting(
    transport: ProductTransport,
  ): Promise<void> {
    const totalQty = transport.productTransportLines.reduce(
      (acc, cur) => (acc += cur.qty),
      0,
    );
    const totalTransportAmount = transport.productTransportServiceLines.reduce(
      (acc, cur) => (acc += cur.price * cur.qty),
      0,
    );

    if (transport.status) {
      await this.warehouseService.transportProducts({
        companyId: transport.companyId,
        warehouseSenderId: transport.warehouseSenderId,
        warehouseReceiveId: transport.warehouseReceiveId,
        transportLines: transport.productTransportLines,
        transportCost: totalTransportAmount
          ? totalTransportAmount / totalQty
          : 0,
      });
    } else {
      await this.warehouseService.unTransportProducts({
        companyId: transport.companyId,
        warehouseSenderId: transport.warehouseSenderId,
        warehouseReceiveId: transport.warehouseReceiveId,
        transportLines: transport.productTransportLines,
        transportCost: totalTransportAmount
          ? totalTransportAmount / totalQty
          : 0,
      });
    }
  }
}
