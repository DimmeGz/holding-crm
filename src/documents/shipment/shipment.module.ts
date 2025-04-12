import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GoodsModule } from '../../goods';
import { ReceiveModule } from '../receive';
import { Shipment, ShipmentLine } from './entities';
import { WarehouseModule } from '../../warehouse';

import { ShipmentService } from './shipment.service';
import { ShipmentController } from './shipment.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Shipment, ShipmentLine]),
    GoodsModule,
    ReceiveModule,
    WarehouseModule,
  ],
  providers: [ShipmentService],
  controllers: [ShipmentController],
  exports: [ShipmentService],
})
export class ShipmentModule {}
