import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  Batch,
  BatchCustomField,
  CustomField,
  Package,
  Product,
  Service,
} from './entities';
import { GoodsService } from './goods.service';
import { GoodsController } from './goods.controller';
import { BatchesService } from './batches.service';
import { BatchesController } from './batches.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Batch,
      BatchCustomField,
      CustomField,
      Package,
      Product,
      Service,
    ]),
  ],
  providers: [GoodsService, BatchesService],
  exports: [GoodsService, BatchesService],
  controllers: [GoodsController, BatchesController],
})
export class GoodsModule {}
