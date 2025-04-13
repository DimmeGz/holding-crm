import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LibsModule } from '../../libs';

import { TransitLine } from './entities';
import { TransitService } from './transit.service';

@Module({
  imports: [TypeOrmModule.forFeature([TransitLine]), LibsModule],
  providers: [TransitService],
  exports: [TransitService],
})
export class TransitModule {}
