import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CompaniesModule } from '../../companies';
import { InvoiceModule } from '../invoice';

import { CommissionInvoice } from './entities';
import { CommissionInvoiceService } from './commission-invoice.service';
import { CommissionInvoiceController } from './commission-invoice.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommissionInvoice]),
    CompaniesModule,
    InvoiceModule,
  ],
  providers: [CommissionInvoiceService],
  controllers: [CommissionInvoiceController],
})
export class CommissionInvoiceModule {}
