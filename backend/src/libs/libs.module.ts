import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CountryOfOrigin, Currency, Incoterms, TechnicalProcess } from './entities';
import { LibsService } from './libs.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TechnicalProcess, Currency, CountryOfOrigin, Incoterms]),
  ],
  providers: [LibsService],
  exports: [LibsService],
})
export class LibsModule {}
