import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import {
  getProductIdsFromProductLines,
  getServiceIdsFromServiceLines,
} from '../../common/utils';

import { GoodsService } from '../../goods';

import { Receive } from './entities';
import { CreateReveiveDTO, UpdateReceiveDTO } from './dto';

@Injectable()
export class ReceiveService {
  constructor(
    @InjectRepository(Receive)
    private readonly receivesRepository: Repository<Receive>,
    @InjectDataSource() private dataSource: DataSource,
    private readonly goodsService: GoodsService,
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

  async createReceive(createReveiveDTO: CreateReveiveDTO) {
    createReveiveDTO['technicalProcesses'] =
      await this.getTechnicalProcesses(createReveiveDTO);

    const newReceive = new Receive(createReveiveDTO);
    newReceive.status = false;
    newReceive.createdAt = new Date();
    newReceive.comment = newReceive.comment || '';
    newReceive.transportPlace = newReceive.transportPlace || '';

    newReceive.documentSum =
      newReceive.receiveLines.reduce(
        (acc, cur) => (acc += cur.price * cur.qty),
        0,
      ) +
      newReceive.receiveServiceLines.reduce(
        (acc, cur) => (acc += cur.price * cur.qty),
        0,
      );

    return await this.receivesRepository.save(newReceive);
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

    // TODO: update technical processes

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
    const invoice = await this.receivesRepository.findOne({
      where: { id: receiveId, status: false },
      relations: ['receiveLines', 'receiveServiceLines'],
    });
    return await this.receivesRepository.remove(invoice);
  }

  async changeReceiveStatus(receiveId: number) {
    const receive = await this.receivesRepository.findOne({
      where: { id: receiveId },
    });

    receive.status = receive.status ? false : true;

    // TODO: make changes in warehouseAccounting

    return await this.receivesRepository.save(receive);
  }
}
