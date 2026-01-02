import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Production } from './entities';
import { LibsModule } from '../../libs';
import { WarehouseModule } from '../../warehouse';

import { ProductionService } from './production.service';
import { ProductionController } from './production.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Production]),
    LibsModule,
    WarehouseModule,
  ],
  providers: [ProductionService],
  controllers: [ProductionController],
})
export class ProductionModule {}
