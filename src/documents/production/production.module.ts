import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Production } from './entities';
import { LibsModule } from '../../libs';

import { ProductionService } from './production.service';
import { ProductionController } from './production.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Production]), LibsModule],
  providers: [ProductionService],
  controllers: [ProductionController],
})
export class ProductionModule {}
