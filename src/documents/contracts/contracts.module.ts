import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Contract } from './entities';
import { GoodsModule } from '../../goods';
import { OrdersModule } from '../orders';
import { ShipmentModule } from '../shipment';

import { ContractsController } from './contracts.controller';
import { ContractsService } from './contracts.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Contract]),
    GoodsModule,
    forwardRef(() => OrdersModule),
    ShipmentModule,
  ],
  controllers: [ContractsController],
  providers: [ContractsService],
  exports: [ContractsService],
})
export class ContractsModule {}
