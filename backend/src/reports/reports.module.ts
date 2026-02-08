import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MonthReportService } from './month-report.service';
import { ProductionReportService } from './production-report.service';
import { ReportsController } from './reports.controller';

import { Company } from '../companies/entities';
import { Invoice } from '../documents/invoices/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Company, Invoice])],
  providers: [ProductionReportService, MonthReportService],
  controllers: [ReportsController],
})
export class ReportsModule {}
