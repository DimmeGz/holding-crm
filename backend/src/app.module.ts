import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { CompaniesModule } from './companies/';
import { DocumentsModule } from './documents';

import { databaseConfig, typeOrmConfig, VALIDATION_SCHEMA } from './config';
import { ReportsModule } from './reports/reports.module';
import { StoreDataModule } from './store-data/store-data.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../.env',
      load: [databaseConfig],
      validationSchema: VALIDATION_SCHEMA,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: typeOrmConfig,
    }),
    CompaniesModule,
    DocumentsModule,
    ReportsModule,
    StoreDataModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
