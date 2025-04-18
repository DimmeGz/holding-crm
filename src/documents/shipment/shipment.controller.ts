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

import { ShipmentService } from './shipment.service';
import { CreateShipmentDTO, UpdateShipmentDTO } from './dto';
import { GetShipmentsQueryDTO } from './dto/query-dto';

@Controller('shipment')
export class ShipmentController {
  constructor(private readonly shipmentService: ShipmentService) {}

  @Get()
  getShipments(@Query() query?: GetShipmentsQueryDTO) {
    return this.shipmentService.getShipments(query);
  }

  @Get(':shipmentId')
  @UsePipes(new ParseIntPipe())
  getShipmentById(@Param('shipmentId') shipmentId: number) {
    return this.shipmentService.getShipmentById(shipmentId);
  }

  @Post()
  createShipment(@Body() createShipmentDTO: CreateShipmentDTO) {
    return this.shipmentService.createShipment(createShipmentDTO);
  }

  @Patch(':shipmentId')
  updateShipment(
    @Param('shipmentId', new ParseIntPipe()) shipmentId: number,
    @Body() updateShipmentDTO: UpdateShipmentDTO,
  ) {
    return this.shipmentService.updateShipment(shipmentId, updateShipmentDTO);
  }

  @Delete(':shipmentId')
  @UsePipes(new ParseIntPipe())
  removeShipment(@Param('shipmentId') shipmentId: number) {
    return this.shipmentService.removeShipment(shipmentId);
  }

  @Patch('change-status/:shipmentId')
  @UsePipes(new ParseIntPipe())
  changeShipmentStatus(@Param('shipmentId') shipmentId: number) {
    return this.shipmentService.changeShipmentStatus(shipmentId);
  }
}
