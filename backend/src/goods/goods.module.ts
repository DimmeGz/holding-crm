import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Batch, Product, Service } from './entities';
import { GoodsService } from './goods.service';
import { GoodsController } from './goods.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Batch, Product, Service])],
  providers: [GoodsService],
  exports: [GoodsService],
  controllers: [GoodsController],
})
export class GoodsModule {}
