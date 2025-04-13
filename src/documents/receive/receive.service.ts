import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

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

  async getReceives() {
    const receives = await this.receivesRepository
      .createQueryBuilder('receive')
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
      ])
      .orderBy('receive.id', 'DESC')
      .getMany();

    return receives;
  }

  async getReceiveById(receiveId: number) {
    const receive = await this.receivesRepository
      .createQueryBuilder('receive')
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
      .where('receive.id = :receiveId', { receiveId })
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
      ])
      .getOne();

    return receive;
  }

  async getReceivesByShipmentId(shipmentId: number) {
    const receives = await this.receivesRepository
      .createQueryBuilder('receive')
      .where('receive.shipmentId = :shipmentId', { shipmentId })
      .select(['receive.id', 'receive.status'])
      .orderBy('receive.id', 'ASC')
      .getMany();

    return receives;
  }

  async createReceive(createReceiveDTO: CreateReveiveDTO) {
    createReceiveDTO['technicalProcesses'] =
      await this.getTechnicalProcesses(createReceiveDTO);

    const newReceive = new Receive(createReceiveDTO);
    newReceive.status = false;
    newReceive.createdAt = new Date();
    newReceive.comment = newReceive.comment || '';
    newReceive.transportPlace = newReceive.transportPlace || '';
    newReceive.transportAmount = newReceive.transportAmount || 0;

    newReceive.documentSum =
      newReceive.receiveLines.reduce(
        (acc, cur) => (acc += cur.price * cur.qty),
        0,
      ) +
      newReceive.receiveServiceLines.reduce(
        (acc, cur) => (acc += cur.price * cur.qty),
        0,
      );

    const createdReceive = await this.receivesRepository.save(newReceive);

    await this.transitService.addReceiveToTransitLines({
      shipmentId: createReceiveDTO.shipmentId,
      receiveId: createdReceive.id,
      lines: createReceiveDTO.receiveLines,
    });

    return createdReceive;
  }

  private async getTechnicalProcesses(createReveiveDTO: CreateReveiveDTO) {
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

  async updateReceive(receiveId: number, updateReceiveDTO: UpdateReceiveDTO) {
    const receive = await this.receivesRepository
      .createQueryBuilder('receive')
      .where('receive.id = :receiveId', { receiveId })
      .andWhere('receive.status = FALSE')
      .leftJoinAndSelect('receive.receiveLines', 'receiveLines')
      .leftJoinAndSelect('receive.receiveServiceLines', 'receiveServiceLines')
      .leftJoinAndSelect('receive.technicalProcesses', 'technicalProcesses')
      .getOne();

    const updatedReceiveLinesIds = [];
    for (const line of updateReceiveDTO.receiveLines) {
      if (line['id']) {
        updatedReceiveLinesIds.push(line['id']);
      }
    }
    const receiveLinesToDelete = receive.receiveLines.filter(
      (line) => !updatedReceiveLinesIds.includes(line.id),
    );

    const updatedReceiveServiceLinesIds = [];
    for (const line of updateReceiveDTO.receiveServiceLines) {
      if (line['id']) {
        updatedReceiveServiceLinesIds.push(line['id']);
      }
    }
    const receiveServiceLinesToDelete = receive.receiveServiceLines.filter(
      (line) => !updatedReceiveServiceLinesIds.includes(line.id),
    );

    const updated = Object.assign(receive, updateReceiveDTO);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    updated.technicalProcesses =
      await this.getTechnicalProcesses(updateReceiveDTO);

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

  async removeReceive(receiveId: number) {
    try {
      const invoice = await this.receivesRepository.findOne({
        where: { id: receiveId, status: false },
        relations: ['receiveLines', 'receiveServiceLines'],
      });
      return await this.receivesRepository.remove(invoice);
    } catch (e) {
      throw new NotFoundException(e);
    }
  }

  async changeReceiveStatus(receiveId: number) {
    const receive = await this.receivesRepository.findOne({
      where: { id: receiveId },
      relations: ['receiveLines'],
    });

    // TODO: make transaction

    receive.status = !receive.status;

    await this.updateWarehouseAccounting(receive);
    await this.updateTransitLines(receive);

    return await this.receivesRepository.save(receive);
  }

  private async updateWarehouseAccounting(receive: Receive) {
    if (receive.status) {
      for await (const line of receive.receiveLines) {
        await this.warehouseService.increaseReceiveGoodsCount({
          companyId: receive.buyerId,
          warehouseId: receive.buyerWarehouseId,
          batchId: line.batchId,
          packageId: line.packageId,
          qty: line.qty,
          price: line.price,
          currencyId: receive.currencyId,
        });
      }
    } else {
      for await (const line of receive.receiveLines) {
        await this.warehouseService.returnReceiveGoodsCount({
          companyId: receive.buyerId,
          warehouseId: receive.buyerWarehouseId,
          batchId: line.batchId,
          packageId: line.packageId,
          qty: line.qty,
          price: line.price,
          currencyId: receive.currencyId,
        });
      }
    }
  }

  private async updateTransitLines(receive: Receive) {
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
