import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Batch, Package, Product, Service } from './entities';
import { GoodsService } from './goods.service';

@Module({
  imports: [TypeOrmModule.forFeature([Batch, Package, Product, Service])],
  providers: [GoodsService],
  exports: [GoodsService],
})
export class GoodsModule {}
