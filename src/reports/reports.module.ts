import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductionReportService } from './production-report.service';
import { ProductionReportController } from './production-report.controller';

import { Company } from '../companies/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Company])],
  providers: [ProductionReportService],
  controllers: [ProductionReportController],
})
export class ReportsModule {}
