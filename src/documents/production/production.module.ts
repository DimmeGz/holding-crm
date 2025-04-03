import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Production } from './entities';

import { ProductionService } from './production.service';
import { ProductionController } from './production.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Production])],
  providers: [ProductionService],
  controllers: [ProductionController],
})
export class ProductionModule {}
