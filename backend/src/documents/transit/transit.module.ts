import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LibsModule } from '../../libs';

import { TransitLine } from './entities';
import { TransitService } from './transit.service';
import { TransitController } from './transit.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TransitLine]), LibsModule],
  providers: [TransitService],
  exports: [TransitService],
  controllers: [TransitController],
})
export class TransitModule {}
