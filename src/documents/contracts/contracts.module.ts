import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Contract } from './entities';
import { ShipmentModule } from '../shipment';

import { ContractsController } from './contracts.controller';
import { ContractsService } from './contracts.service';

@Module({
  imports: [TypeOrmModule.forFeature([Contract]), ShipmentModule],
  controllers: [ContractsController],
  providers: [ContractsService],
})
export class ContractsModule {}
