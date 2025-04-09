import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { ReceiveService } from './receive.service';

import { CreateReveiveDTO, UpdateReceiveDTO } from './dto';

@Controller('receive')
export class ReceiveController {
  constructor(private readonly receiveService: ReceiveService) {}

  @Get()
  getReceives() {
    return this.receiveService.getReceives();
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
