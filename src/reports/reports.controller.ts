import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';

import { ProductionReportService } from './production-report.service';
import { MonthReportService } from './month-report.service';

import { ReportQueryDTO } from './dto/query-dto';

@Controller('reports')
export class ReportsController {
  constructor(
    private readonly monthReportService: MonthReportService,
    private readonly productionReportService: ProductionReportService,
  ) {}

  @Get('production-report/:companyId')
  productionReport(
    @Param('companyId', new ParseIntPipe()) companyId: number,
    @Query() query?: ReportQueryDTO,
  ) {
    return this.productionReportService.productionReport(companyId, query);
  }

  @Get('month-report/:companyId')
  monthReport(
    @Param('companyId', new ParseIntPipe()) companyId: number,
    @Query() query?: ReportQueryDTO,
  ) {
    return this.monthReportService.monthReport(companyId, query);
  }
}
