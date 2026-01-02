import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TechnicalProcess } from './entities';
import { LibsService } from './libs.service';

@Module({
  imports: [TypeOrmModule.forFeature([TechnicalProcess])],
  providers: [LibsService],
  exports: [LibsService],
})
export class LibsModule {}
