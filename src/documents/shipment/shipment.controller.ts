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

  @Patch('change-status/:shipmentId')
  changeShipmentStatus(@Param('shipmentId') shipmentId: number) {
    return this.shipmentService.changeShipmentStatus(shipmentId);
  }
}
