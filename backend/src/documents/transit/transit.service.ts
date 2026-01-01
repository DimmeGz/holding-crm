import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';

import { LibsService } from '../../libs';

import { TransitLine } from './entities';
import {
  AddReceiveToTransitLineDTO,
  CreateTransitLinesDTO,
  ReceiveTransitLinesDTO,
} from './dto';

@Injectable()
export class TransitService {
  constructor(
    @InjectRepository(TransitLine)
    private readonly transitLinesRepository: Repository<TransitLine>,
    private readonly libsService: LibsService,
  ) {}

  private createBaseQueryBuilder(): SelectQueryBuilder<TransitLine> {
    return this.transitLinesRepository.createQueryBuilder('transitLine');
  }

  private applyTransitLineListSelect(
    qb: SelectQueryBuilder<TransitLine>,
  ): SelectQueryBuilder<TransitLine> {
    return qb
      .leftJoin('transitLine.shipment', 'shipment')
      .leftJoin('shipment.seller', 'seller')
      .leftJoin('transitLine.receive', 'receive')
      .leftJoin('receive.buyer', 'buyer')
      .leftJoin('transitLine.batch', 'batch')
      .leftJoin('batch.product', 'product')
      .leftJoin('transitLine.package', 'package')
      .select([
        'transitLine.id',
        'transitLine.qty',
        'seller.id',
        'seller.name',
        'buyer.id',
        'buyer.name',
        'shipment.id',
        'shipment.expectedDate',
        'receive.id',
        'receive.expectedDate',
        'product.id',
        'product.name',
        'batch.id',
        'batch.name',
        'package.id',
        'package.name',
      ]);
  }

  async getTransitLines(): Promise<TransitLine[]> {
    return await this.applyTransitLineListSelect(this.createBaseQueryBuilder())
      .where('transitLine.qty != 0')
      .getMany();
  }

  async createTransitLine(
    createTransitLineDTO: CreateTransitLinesDTO,
  ): Promise<void> {
    const newTransitLines: TransitLine[] = [];

    for (const line of createTransitLineDTO.lines) {
      const newTransitLine = this.transitLinesRepository.create({
        shipmentId: createTransitLineDTO.shipmentId,
        ...line,
      });

      newTransitLine.technicalProcesses =
        await this.libsService.getTechnicalProcessesByBatchId(line.batchId);

      newTransitLines.push(newTransitLine);
    }

    await this.transitLinesRepository.save(newTransitLines);
  }

  async removeTransitLines(shipmentId: number): Promise<void> {
    await this.transitLinesRepository.delete({ shipmentId });
  }

  async addReceiveToTransitLines(
    addReceiveDTO: AddReceiveToTransitLineDTO,
  ): Promise<void> {
    const linesToUpdate = await Promise.all(
      addReceiveDTO.lines.map(async (line) => {
        const transitLine = await this.transitLinesRepository.findOneBy({
          shipmentId: addReceiveDTO.shipmentId,
          batchId: line.batchId,
          packageId: line.packageId,
        });
        transitLine.receiveId = addReceiveDTO.receiveId;
        return transitLine;
      }),
    );

    await this.transitLinesRepository.save(linesToUpdate);
  }

  async receiveTransitLines(receiveDTO: ReceiveTransitLinesDTO): Promise<void> {
    await this.updateTransitLinesQty(receiveDTO, false);
  }

  async cancelReceiveTransitLines(
    receiveDTO: ReceiveTransitLinesDTO,
  ): Promise<void> {
    await this.updateTransitLinesQty(receiveDTO, true);
  }

  private async updateTransitLinesQty(
    receiveDTO: ReceiveTransitLinesDTO,
    isCancel: boolean,
  ): Promise<void> {
    const linesToUpdate = await Promise.all(
      receiveDTO.lines.map(async (line) => {
        const transitLine = await this.transitLinesRepository.findOneBy({
          receiveId: receiveDTO.receiveId,
          batchId: line.batchId,
          packageId: line.packageId,
        });

        transitLine.qty += isCancel ? line.qty : -line.qty;
        return transitLine;
      }),
    );

    await this.transitLinesRepository.save(linesToUpdate);
  }
}
