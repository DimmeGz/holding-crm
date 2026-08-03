import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
} from '@nestjs/common';

import { ProductionReportService } from './production-report.service';
import { MonthReportService } from './month-report.service';
import { MonthDataService } from './month-data.service';
import { ReportQueryDTO } from './dto/query-dto';
import { UpdateMonthDataDTO } from './dto/update-month-data.dto';

@Controller('reports')
export class ReportsController {
  constructor(
    private readonly monthReportService: MonthReportService,
    private readonly monthDataService: MonthDataService,
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

  @Patch('month-data/:companyId')
  upsertMonthData(
    @Param('companyId', new ParseIntPipe()) companyId: number,
    @Body() body: UpdateMonthDataDTO,
  ) {
    return this.monthDataService.upsert(companyId, body);
  }
}
