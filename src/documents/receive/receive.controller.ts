import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { ReceiveService } from './receive.service';

import { CreateReveiveDTO, UpdateReceiveDTO } from './dto';
import { GetReceivesQueryDTO } from './dto/query-dto';

@Controller('receive')
export class ReceiveController {
  constructor(private readonly receiveService: ReceiveService) {}

  @Get()
  getReceives(@Query() query?: GetReceivesQueryDTO) {
    return this.receiveService.getReceives(query);
  }

  @Get(':receiveId')
  getReceiveById(@Param('receiveId') receiveId: number) {
    return this.receiveService.getReceiveById(receiveId);
  }

  @Post()
  createReceive(@Body() createReveiveDTO: CreateReveiveDTO) {
    return this.receiveService.createReceive(createReveiveDTO);
  }

  @Patch(':receiveId')
  updateReceive(
    @Param('receiveId') receiveId: number,
    @Body() updateReceiveDTO: UpdateReceiveDTO,
  ) {
    return this.receiveService.updateReceive(receiveId, updateReceiveDTO);
  }

  @Delete(':receiveId')
  removeReceive(@Param('receiveId') receiveId: number) {
    return this.receiveService.removeReceive(receiveId);
  }

  @Patch('change-status/:receiveId')
  changeShipmentStatus(@Param('receiveId') receiveId: number) {
    return this.receiveService.changeReceiveStatus(receiveId);
  }
}
