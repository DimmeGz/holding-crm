import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';

import { DataSource, Repository } from 'typeorm';

import { LibsService } from '../../libs';
import { ProductTransport } from './entities';
import { CreateProductTransportDTO, UpdateProductTransportDTO } from './dto';

@Injectable()
export class ProductTransportService {
  constructor(
    @InjectRepository(ProductTransport)
    private readonly productTransportRepository: Repository<ProductTransport>,
    @InjectDataSource() private dataSource: DataSource,
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

  async createProductTransport(createTransportDTO: CreateProductTransportDTO) {
    const newTransport = new ProductTransport(createTransportDTO);
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
  ) {
    const transport = await this.productTransportRepository
      .createQueryBuilder('transport')
      .where('transport.id = :productTransportId', {
        productTransportId,
      })
      .andWhere('transport.status = FALSE')
      .leftJoinAndSelect(
        'transport.productTransportLines',
        'productTransportLines',
      )
      .leftJoinAndSelect(
        'transport.productTransportServiceLines',
        'productTransportServiceLines',
      )
      .leftJoinAndSelect('transport.technicalProcesses', 'technicalProcesses')
      .getOne();

    const updatedTranportLinesIds = [];
    for (const line of updateTransportDTO.productTransportLines) {
      if (line['id']) {
        updatedTranportLinesIds.push(line['id']);
      }
    }
    const tranportLinesToDelete = transport.productTransportLines.filter(
      (line) => !updatedTranportLinesIds.includes(line.id),
    );

    const updatedTranportServiceLinesIds = [];
    for (const line of updateTransportDTO.productTransportServiceLines) {
      if (line['id']) {
        updatedTranportServiceLinesIds.push(line['id']);
      }
    }
    const tranportServiceLinesToDelete =
      transport.productTransportServiceLines.filter(
        (line) => !updatedTranportServiceLinesIds.includes(line.id),
      );

    const updated = Object.assign(transport, updateTransportDTO);

    // TODO: update technical processes

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (tranportLinesToDelete.length) {
        await queryRunner.manager.remove(tranportLinesToDelete);
      }

      if (tranportServiceLinesToDelete.length) {
        await queryRunner.manager.remove(tranportServiceLinesToDelete);
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
}
