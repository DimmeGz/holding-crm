import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Batch, Package, Product, Service } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([Batch, Package, Product, Service])],
})
export class GoodsModule {}
