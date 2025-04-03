import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Shipment } from './entities';
import { ShipmentService } from './shipment.service';
import { ShipmentController } from './shipment.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Shipment])],
  providers: [ShipmentService],
  controllers: [ShipmentController],
})
export class ShipmentModule {}
