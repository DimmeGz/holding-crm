import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Shipment } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([Shipment])],
})
export class ShipmentModule {}
