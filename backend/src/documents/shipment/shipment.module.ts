import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GoodsModule } from '../../goods';
import { ReceiveModule } from '../receive';
import { TransitModule } from '../transit';
import { WarehouseModule } from '../../warehouse';

import { ShipmentService } from './shipment.service';
import { ShipmentController } from './shipment.controller';
import { Shipment, ShipmentLine } from './entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([Shipment, ShipmentLine]),
    GoodsModule,
    ReceiveModule,
    TransitModule,
    WarehouseModule,
  ],
  providers: [ShipmentService],
  controllers: [ShipmentController],
  exports: [ShipmentService],
})
export class ShipmentModule {}
