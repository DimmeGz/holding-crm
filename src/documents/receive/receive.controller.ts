import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UsePipes,
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
  @UsePipes(new ParseIntPipe())
  getReceiveById(@Param('receiveId') receiveId: number) {
    return this.receiveService.getReceiveById(receiveId);
  }

  @Post()
  createReceive(@Body() createReveiveDTO: CreateReveiveDTO) {
    return this.receiveService.createReceive(createReveiveDTO);
  }

  @Patch(':receiveId')
  updateReceive(
    @Param('receiveId', new ParseIntPipe()) receiveId: number,
    @Body() updateReceiveDTO: UpdateReceiveDTO,
  ) {
    return this.receiveService.updateReceive(receiveId, updateReceiveDTO);
  }

  @Delete(':receiveId')
  @UsePipes(new ParseIntPipe())
  removeReceive(@Param('receiveId') receiveId: number) {
    return this.receiveService.removeReceive(receiveId);
  }

  @Patch('change-status/:receiveId')
  @UsePipes(new ParseIntPipe())
  changeShipmentStatus(@Param('receiveId') receiveId: number) {
    return this.receiveService.changeReceiveStatus(receiveId);
  }
}
