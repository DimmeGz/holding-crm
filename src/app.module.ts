import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { CompaniesModule } from './companies/';
import { DocumentsModule } from './documents';

import { DB_CONFIG, VALIDATION_SCHEMA } from './config';
import { ReportsModule } from './reports/reports.module';

@Module({
  imports: [
    ConfigModule.forRoot({ validationSchema: VALIDATION_SCHEMA }),
    TypeOrmModule.forRoot(DB_CONFIG),
    CompaniesModule,
    DocumentsModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
