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
import { Receive } from './entities';
import { GetReceivesQueryDTO } from './dto/query-dto';

@Controller('receives')
export class ReceiveController {
  constructor(private readonly receiveService: ReceiveService) {}

  @Get()
  getReceives(@Query() query?: GetReceivesQueryDTO): Promise<Receive[]> {
    return this.receiveService.getReceives(query);
  }

  @Get(':receiveId')
  @UsePipes(new ParseIntPipe())
  getReceiveById(@Param('receiveId') receiveId: number): Promise<Receive> {
    return this.receiveService.getReceiveById(receiveId);
  }

  @Post()
  createReceive(@Body() createReveiveDTO: CreateReveiveDTO): Promise<Receive> {
    return this.receiveService.createReceive(createReveiveDTO);
  }

  @Patch(':receiveId')
  updateReceive(
    @Param('receiveId', new ParseIntPipe()) receiveId: number,
    @Body() updateReceiveDTO: UpdateReceiveDTO,
  ): Promise<Receive> {
    return this.receiveService.updateReceive(receiveId, updateReceiveDTO);
  }

  @Delete(':receiveId')
  @UsePipes(new ParseIntPipe())
  removeReceive(@Param('receiveId') receiveId: number): Promise<Receive> {
    return this.receiveService.removeReceive(receiveId);
  }

  @Patch('change-status/:receiveId')
  @UsePipes(new ParseIntPipe())
  changeShipmentStatus(
    @Param('receiveId') receiveId: number,
  ): Promise<Receive> {
    return this.receiveService.changeReceiveStatus(receiveId);
  }
}
