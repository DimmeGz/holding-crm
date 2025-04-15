import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';

import {
  getProductIdsFromProductLines,
  getServiceIdsFromServiceLines,
} from '../../common/utils';

import { GoodsService } from '../../goods';
import { TransitService } from '../transit';
import { WarehouseService } from '../../warehouse';

import { Receive } from './entities';
import { CreateReveiveDTO, UpdateReceiveDTO } from './dto';

@Injectable()
export class ReceiveService {
  constructor(
    @InjectRepository(Receive)
    private readonly receivesRepository: Repository<Receive>,
    @InjectDataSource() private dataSource: DataSource,
    private readonly goodsService: GoodsService,
    private readonly transitService: TransitService,
    private readonly warehouseService: WarehouseService,
  ) {}

  private createBaseQueryBuilder(): SelectQueryBuilder<Receive> {
    return this.receivesRepository.createQueryBuilder('receive');
  }

  private applyReceiveListSelect(
    qb: SelectQueryBuilder<Receive>,
  ): SelectQueryBuilder<Receive> {
    return qb
      .leftJoin('receive.seller', 'seller')
      .leftJoin('receive.buyer', 'buyer')
      .leftJoin('receive.shipment', 'shipment')
      .leftJoin('receive.currency', 'currency')
      .select([
        'receive.id',
        'receive.expectedDate',
        'receive.documentSum',
        'receive.status',
        'seller.name',
        'buyer.name',
        'shipment.id',
        'currency.name',
      ]);
  }

  private applyReceiveDetailSelect(
    qb: SelectQueryBuilder<Receive>,
  ): SelectQueryBuilder<Receive> {
    return qb
      .leftJoin('receive.seller', 'seller')
      .leftJoin('receive.buyer', 'buyer')
      .leftJoin('receive.buyerWarehouse', 'buyerWarehouse')
      .leftJoin('receive.shipment', 'shipment')
      .leftJoin('shipment.invoice', 'invoice')
      .leftJoin('receive.currency', 'currency')
      .leftJoin('receive.receiveLines', 'receiveLine')
      .leftJoin('receiveLine.product', 'product')
      .leftJoin('receiveLine.batch', 'batch')
      .leftJoin('receiveLine.package', 'package')
      .select([
        'receive.id',
        'receive.expectedDate',
        'receive.documentSum',
        'receive.status',
        'receive.incoterms',
        'receive.transportPlace',
        'receive.transportAmount',
        'receive.comment',
        'seller.name',
        'buyer.name',
        'buyerWarehouse.name',
        'shipment.id',
        'invoice.id',
        'invoice.invoiceNumber',
        'currency.name',
        'receiveLine',
        'product.name',
        'batch.id',
        'batch.name',
        'package.name',
        'package.capacity',
      ]);
  }

  async getReceives(): Promise<Receive[]> {
    return await this.applyReceiveListSelect(this.createBaseQueryBuilder())
      .orderBy('receive.id', 'DESC')
      .getMany();
  }

  async getReceiveById(receiveId: number): Promise<Receive> {
    const receive = await this.applyReceiveDetailSelect(
      this.createBaseQueryBuilder(),
    )
      .where('receive.id = :receiveId', { receiveId })
      .getOne();

    if (!receive) {
      throw new NotFoundException(`Receive with id: ${receiveId} not found`);
    }

    return receive;
  }

  async getReceivesByShipmentId(shipmentId: number): Promise<Receive[]> {
    return await this.createBaseQueryBuilder()
      .where('receive.shipmentId = :shipmentId', { shipmentId })
      .select(['receive.id', 'receive.status'])
      .orderBy('receive.id', 'ASC')
      .getMany();
  }

  async createReceive(createReceiveDTO: CreateReveiveDTO): Promise<Receive> {
    const newReceive = new Receive(createReceiveDTO);
    newReceive.status = false;
    newReceive.createdAt = new Date();
    newReceive.comment = newReceive.comment || '';
    newReceive.transportPlace = newReceive.transportPlace || '';
    newReceive.transportAmount = newReceive.transportAmount || 0;
    newReceive.documentSum = this.calculateDocumentSum(createReceiveDTO);
    newReceive.technicalProcesses =
      await this.getTechnicalProcesses(createReceiveDTO);

    const createdReceive = await this.receivesRepository.save(newReceive);

    await this.transitService.addReceiveToTransitLines({
      shipmentId: createReceiveDTO.shipmentId,
      receiveId: createdReceive.id,
      lines: createReceiveDTO.receiveLines,
    });

    return createdReceive;
  }

  private calculateDocumentSum(createReceiveDTO: CreateReveiveDTO): number {
    return (
      createReceiveDTO.receiveLines.reduce(
        (acc, cur) => (acc += cur.price * cur.qty),
        0,
      ) +
      createReceiveDTO.receiveServiceLines.reduce(
        (acc, cur) => (acc += cur.price * cur.qty),
        0,
      )
    );
  }

  private async getTechnicalProcesses(
    createReveiveDTO: CreateReveiveDTO,
  ): Promise<{ id: number }[]> {
    const productIds = getProductIdsFromProductLines(
      createReveiveDTO.receiveLines,
    );
    const productProcesses =
      await this.goodsService.getTechnicalProcessesFromProductIds(productIds);

    const serviceIds = getServiceIdsFromServiceLines(
      createReveiveDTO.receiveServiceLines,
    );
    const serviceProcesses =
      await this.goodsService.getTechnicalProcessesFromServiceIds(serviceIds);

    const technicalProcesses = [
      ...new Set([...productProcesses, ...serviceProcesses]),
    ];

    return technicalProcesses.map((process) => ({ id: process.id }));
  }

  async updateReceive(
    receiveId: number,
    updateReceiveDTO: UpdateReceiveDTO,
  ): Promise<Receive> {
    const receive = await this.createBaseQueryBuilder()
      .where('receive.id = :receiveId', { receiveId })
      .andWhere('receive.status = FALSE')
      .leftJoinAndSelect('receive.receiveLines', 'receiveLines')
      .leftJoinAndSelect('receive.receiveServiceLines', 'receiveServiceLines')
      .leftJoinAndSelect('receive.technicalProcesses', 'technicalProcesses')
      .getOne();

    if (!receive) {
      throw new NotFoundException(
        `Receive with id: ${receiveId} and status: false not found`,
      );
    }

    const updatedReceiveLinesIds = updateReceiveDTO.receiveLines
      .filter((line) => line['id'])
      .map((line) => line['id']);
    const receiveLinesToDelete = receive.receiveLines.filter(
      (line) => !updatedReceiveLinesIds.includes(line.id),
    );

    const updatedReceiveServiceLinesIds = updateReceiveDTO.receiveServiceLines
      .filter((line) => line['id'])
      .map((line) => line['id']);
    const receiveServiceLinesToDelete = receive.receiveServiceLines.filter(
      (line) => !updatedReceiveServiceLinesIds.includes(line.id),
    );

    const updated = Object.assign(receive, updateReceiveDTO);
    updated.documentSum = this.calculateDocumentSum(updated);
    updated.technicalProcesses = await this.getTechnicalProcesses(updated);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (receiveLinesToDelete.length) {
        await queryRunner.manager.remove(receiveLinesToDelete);
      }

      if (receiveServiceLinesToDelete.length) {
        await queryRunner.manager.remove(receiveServiceLinesToDelete);
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

  async removeReceive(receiveId: number): Promise<Receive> {
    const receive = await this.receivesRepository.findOne({
      where: { id: receiveId, status: false },
      relations: ['receiveLines', 'receiveServiceLines'],
    });

    if (!receive) {
      throw new NotFoundException(
        `Receive with id: ${receiveId} and status: false not found`,
      );
    }

    return await this.receivesRepository.remove(receive);
  }

  async changeReceiveStatus(receiveId: number): Promise<Receive> {
    const receive = await this.receivesRepository.findOne({
      where: { id: receiveId },
      relations: ['receiveLines'],
    });

    if (!receive) {
      throw new NotFoundException(`Receive with id: ${receiveId} not found`);
    }

    receive.status = !receive.status;

    await this.updateWarehouseAccounting(receive);
    await this.updateTransitLines(receive);

    return await this.receivesRepository.save(receive);
  }

  private async updateWarehouseAccounting(receive: Receive): Promise<void> {
    const warehousePromises = receive.receiveLines.map((line) => {
      if (receive.status) {
        return this.warehouseService.increaseReceiveGoodsCount({
          companyId: receive.buyerId,
          warehouseId: receive.buyerWarehouseId,
          batchId: line.batchId,
          packageId: line.packageId,
          qty: line.qty,
          price: line.price,
          currencyId: receive.currencyId,
        });
      } else {
        return this.warehouseService.returnReceiveGoodsCount({
          companyId: receive.buyerId,
          warehouseId: receive.buyerWarehouseId,
          batchId: line.batchId,
          packageId: line.packageId,
          qty: line.qty,
          price: line.price,
          currencyId: receive.currencyId,
        });
      }
    });

    await Promise.all(warehousePromises);
  }

  private async updateTransitLines(receive: Receive): Promise<void> {
    if (receive.status) {
      await this.transitService.receiveTransitLines({
        receiveId: receive.id,
        lines: receive.receiveLines,
      });
    } else {
      await this.transitService.cancelReceiveTransitLines({
        receiveId: receive.id,
        lines: receive.receiveLines,
      });
    }
  }
}
