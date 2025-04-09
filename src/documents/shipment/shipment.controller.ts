import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { ShipmentService } from './shipment.service';
import { CreateShipmentDTO } from './dto/create-shipment.dto';

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
}
