import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { ReceiveService } from './receive.service';

import { CreateReveiveDTO } from './dto';

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
}
