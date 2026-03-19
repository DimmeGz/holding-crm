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

import { Shipment } from './entities';

import { CreateShipmentDTO, UpdateShipmentDTO } from './dto';
import { GetShipmentsQueryDTO } from './dto/query-dto';
import { GetShipmentResponseDTO } from './dto/response-dto';

@Controller('shipments')
export class ShipmentController {
  constructor(private readonly shipmentService: ShipmentService) {}

  @Get()
  getShipments(@Query() query?: GetShipmentsQueryDTO): Promise<Shipment[]> {
    return this.shipmentService.getShipments(query);
  }

  @Get(':shipmentId')
  @UsePipes(new ParseIntPipe())
  getShipmentById(
    @Param('shipmentId') shipmentId: number,
  ): Promise<GetShipmentResponseDTO> {
    return this.shipmentService.getShipmentById(shipmentId);
  }

  @Post()
  createShipment(
    @Body() createShipmentDTO: CreateShipmentDTO,
  ): Promise<Shipment> {
    return this.shipmentService.createShipment(createShipmentDTO);
  }

  @Patch(':shipmentId')
  updateShipment(
    @Param('shipmentId', new ParseIntPipe()) shipmentId: number,
    @Body() updateShipmentDTO: UpdateShipmentDTO,
  ): Promise<Shipment> {
    return this.shipmentService.updateShipment(shipmentId, updateShipmentDTO);
  }

  @Delete(':shipmentId')
  @UsePipes(new ParseIntPipe())
  removeShipment(@Param('shipmentId') shipmentId: number): Promise<Shipment> {
    return this.shipmentService.removeShipment(shipmentId);
  }

  @Patch('change-status/:shipmentId')
  @UsePipes(new ParseIntPipe())
  changeShipmentStatus(
    @Param('shipmentId') shipmentId: number,
  ): Promise<Shipment> {
    return this.shipmentService.changeShipmentStatus(shipmentId);
  }
}
