import { Controller, Get, Param } from '@nestjs/common';

import { ShipmentService } from './shipment.service';

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
}
