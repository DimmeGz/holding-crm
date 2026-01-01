import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GoodsModule } from '../../goods';
import { TransitModule } from '../transit';
import { WarehouseModule } from '../../warehouse';

import { ReceiveService } from './receive.service';
import { ReceiveController } from './receive.controller';

import { Receive } from './entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([Receive]),
    GoodsModule,
    TransitModule,
    WarehouseModule,
  ],
  providers: [ReceiveService],
  controllers: [ReceiveController],
  exports: [ReceiveService],
})
export class ReceiveModule {}
