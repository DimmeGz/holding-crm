import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ReceiveService } from './receive.service';
import { ReceiveController } from './receive.controller';

import { Receive } from './entities';
import { GoodsModule } from '../../goods';
import { WarehouseModule } from '../../warehouse';

@Module({
  imports: [TypeOrmModule.forFeature([Receive]), GoodsModule, WarehouseModule],
  providers: [ReceiveService],
  controllers: [ReceiveController],
  exports: [ReceiveService],
})
export class ReceiveModule {}
