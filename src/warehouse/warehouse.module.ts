import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Warehouse } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([Warehouse])],
})
export class WarehouseModule {}
