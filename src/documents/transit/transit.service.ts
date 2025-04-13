import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { LibsService } from '../../libs';

import { TransitLine } from './entities';
import { CreateTransitLinesDTO } from './dto';

@Injectable()
export class TransitService {
  constructor(
    @InjectRepository(TransitLine)
    private readonly transitLinesRepository: Repository<TransitLine>,
    private readonly libsService: LibsService,
  ) {}

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
}
