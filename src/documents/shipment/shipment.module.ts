import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Shipment, ShipmentLine } from './entities';
import { ReceiveModule } from '../receive';

import { ShipmentService } from './shipment.service';
import { ShipmentController } from './shipment.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Shipment, ShipmentLine]), ReceiveModule],
  providers: [ShipmentService],
  controllers: [ShipmentController],
  exports: [ShipmentService],
})
export class ShipmentModule {}
