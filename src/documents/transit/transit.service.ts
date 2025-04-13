import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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

  async getTransitLines() {
    const transitLines = await this.transitLinesRepository
      .createQueryBuilder('transitLine')
      .leftJoin('transitLine.shipment', 'shipment')
      .leftJoin('shipment.seller', 'seller')
      .leftJoin('transitLine.receive', 'receive')
      .leftJoin('receive.buyer', 'buyer')
      .leftJoin('transitLine.batch', 'batch')
      .leftJoin('batch.product', 'product')
      .leftJoin('transitLine.package', 'package')
      .where('transitLine.qty != 0')
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
      ])
      .getMany();

    return transitLines;
  }

  async createTransitLine(createTransitLineDTO: CreateTransitLinesDTO) {
    const newTransitLines: TransitLine[] = [];

    for (const line of createTransitLineDTO.lines) {
      const newTransitLine = new TransitLine({
        shipmentId: createTransitLineDTO.shipmentId,
        ...line,
      });

      newTransitLine.technicalProcesses =
        await this.libsService.getTechnicalProcessesByBatchId(line.batchId);

      newTransitLines.push(newTransitLine);
    }

    await this.transitLinesRepository.save(newTransitLines);
  }

  async removeTransitLines(shipmentId: number) {
    const transitLines = await this.transitLinesRepository.findBy({
      shipmentId,
    });

    await this.transitLinesRepository.remove(transitLines);
  }

  async addReceiveToTransitLines(addReceiveDTO: AddReceiveToTransitLineDTO) {
    const linesToUpdate: TransitLine[] = [];

    for (const line of addReceiveDTO.lines) {
      const transitLine = await this.transitLinesRepository.findOneBy({
        shipmentId: addReceiveDTO.shipmentId,
        batchId: line.batchId,
        packageId: line.packageId,
      });
      transitLine.receiveId = addReceiveDTO.receiveId;
      linesToUpdate.push(transitLine);
    }

    await this.transitLinesRepository.save(linesToUpdate);
  }

  async receiveTransitLines(receiveDTO: ReceiveTransitLinesDTO) {
    const linesToUpdate: TransitLine[] = [];

    for (const line of receiveDTO.lines) {
      const transitLine = await this.transitLinesRepository.findOneBy({
        receiveId: receiveDTO.receiveId,
        batchId: line.batchId,
        packageId: line.packageId,
      });

      transitLine.qty -= line.qty;
      linesToUpdate.push(transitLine);
    }

    await this.transitLinesRepository.save(linesToUpdate);
  }

  async cancelReceiveTransitLines(receiveDTO: ReceiveTransitLinesDTO) {
    const linesToUpdate: TransitLine[] = [];

    for (const line of receiveDTO.lines) {
      const transitLine = await this.transitLinesRepository.findOneBy({
        receiveId: receiveDTO.receiveId,
        batchId: line.batchId,
        packageId: line.packageId,
      });
      transitLine.qty += line.qty;
      linesToUpdate.push(transitLine);
    }

    await this.transitLinesRepository.save(linesToUpdate);
  }
}
