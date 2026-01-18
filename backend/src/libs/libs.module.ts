import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Currency, TechnicalProcess } from './entities';
import { LibsService } from './libs.service';

@Module({
  imports: [TypeOrmModule.forFeature([TechnicalProcess, Currency])],
  providers: [LibsService],
  exports: [LibsService],
})
export class LibsModule {}
