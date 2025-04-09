import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { ShipmentService } from './shipment.service';
import { CreateShipmentDTO } from './dto/create-shipment.dto';
import { UpdateShipmentDTO } from './dto';

@Controller('shipment')
export class ShipmentController {
  constructor(private readonly shipmentService: ShipmentService) {}

  @Get()
  getShipments() {
    return this.shipmentService.getShipments();
  }

  @Get(':shipmentId')
  getShipmentById(@Param('shipmentId') shipmentId: number) {
    return this.shipmentService.getShipmentById(shipmentId);
  }

  @Post()
  createShipment(@Body() createShipmentDTO: CreateShipmentDTO) {
    return this.shipmentService.createShipment(createShipmentDTO);
  }

  @Patch(':shipmentId')
  updateShipment(
    @Param('shipmentId') shipmentId: number,
    @Body() updateShipmentDTO: UpdateShipmentDTO,
  ) {
    return this.shipmentService.updateShipment(shipmentId, updateShipmentDTO);
  }

  @Delete(':shipmentId')
  removeShipment(@Param('shipmentId') shipmentId: number) {
    return this.shipmentService.removeShipment(shipmentId);
  }
}
