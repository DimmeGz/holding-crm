import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MonthReportService } from './month-report.service';
import { MonthDataService } from './month-data.service';
import { ProductionReportService } from './production-report.service';
import { ReportsController } from './reports.controller';
import { MonthData } from './entities';

import { Company } from '../companies/entities';
import {
  Invoice,
  InvoiceLine,
  InvoiceServiceLine,
} from '../documents/invoices/entities';
import { PaymentLine } from '../documents/payment/entities';
import { CommissionInvoice } from '../documents/commission-invoice/entities';
import { CommissionPaymentLine } from '../documents/commission-payment/entities';
import { Incoterms } from '../libs/entities';
import { Product } from '../goods/entities';
import { Order } from '../documents/orders/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Company,
      Invoice,
      InvoiceLine,
      InvoiceServiceLine,
      PaymentLine,
      CommissionInvoice,
      CommissionPaymentLine,
      Incoterms,
      Product,
      Order,
      MonthData,
    ]),
  ],
  providers: [ProductionReportService, MonthReportService, MonthDataService],
  controllers: [ReportsController],
})
export class ReportsModule {}
