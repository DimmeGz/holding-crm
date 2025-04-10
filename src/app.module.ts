import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { CompaniesModule } from './companies/';
import { DocumentsModule } from './documents';
import { LibsModule } from './libs';
import { WarehouseModule } from './warehouse';

import { DB_CONFIG, VALIDATION_SCHEMA } from './config';
import { CommissionInvoiceService } from './commission-invoice/commission-invoice.service';
import { CommissionInvoiceController } from './commission-invoice/commission-invoice.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ validationSchema: VALIDATION_SCHEMA }),
    TypeOrmModule.forRoot(DB_CONFIG),
    CompaniesModule,
    DocumentsModule,
    LibsModule,
    WarehouseModule,
  ],
  controllers: [AppController, CommissionInvoiceController],
  providers: [AppService, CommissionInvoiceService],
})
export class AppModule {}
