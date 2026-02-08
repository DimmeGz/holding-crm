import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CountryOfOrigin, Currency, TechnicalProcess } from './entities';
import { LibsService } from './libs.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TechnicalProcess, Currency, CountryOfOrigin]),
  ],
  providers: [LibsService],
  exports: [LibsService],
})
export class LibsModule {}
