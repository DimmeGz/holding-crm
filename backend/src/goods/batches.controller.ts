import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { BatchesService } from './batches.service';
import { CreateBatchDTO } from './dto/create-batch.dto';
import { UpdateBatchDTO } from './dto/update-batch.dto';
import { GetBatchesQueryDTO } from './dto/get-batches-query.dto';
import { BatchesListGroupDTO } from './dto/get-batches-list-response.dto';
import { GetBatchDetailResponseDTO } from './dto/get-batch-detail-response.dto';
import { Batch } from './entities/batch.entity';

@Controller('goods/batches')
export class BatchesController {
  constructor(private readonly batchesService: BatchesService) {}

  @Get()
  getBatchesList(
    @Query() query: GetBatchesQueryDTO,
  ): Promise<BatchesListGroupDTO[]> {
    return this.batchesService.getBatchesList(query.process);
  }

  @Get(':id')
  getBatchDetail(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GetBatchDetailResponseDTO> {
    return this.batchesService.getBatchDetail(id);
  }

  @Post()
  createBatch(@Body() dto: CreateBatchDTO): Promise<Batch> {
    return this.batchesService.createBatch(dto);
  }

  @Patch(':id')
  updateBatch(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateBatchDTO,
  ): Promise<Batch> {
    return this.batchesService.updateBatch(id, dto);
  }
}
