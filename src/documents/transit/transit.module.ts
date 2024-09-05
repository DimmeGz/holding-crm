import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TransitLine } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([TransitLine])],
})
export class TransitModule {}
