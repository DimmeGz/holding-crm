import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MonthReportService } from './month-report.service';
import { MonthDataService } from './month-data.service';
import { YearReportService } from './year-report.service';
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
import { WarehouseAccounting } from '../warehouse/entities';

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
      WarehouseAccounting,
    ]),
  ],
  providers: [
    ProductionReportService,
    MonthReportService,
    MonthDataService,
    YearReportService,
  ],
  controllers: [ReportsController],
})
export class ReportsModule {}
