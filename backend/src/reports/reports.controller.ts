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
import { YearReportService } from './year-report.service';
import { ReportQueryDTO, YearReportQueryDTO } from './dto/query-dto';
import { UpdateMonthDataDTO } from './dto/update-month-data.dto';
import { SaveCashflowDTO } from './dto/save-cashflow.dto';

@Controller('reports')
export class ReportsController {
  constructor(
    private readonly monthReportService: MonthReportService,
    private readonly monthDataService: MonthDataService,
    private readonly yearReportService: YearReportService,
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

  @Get('year-report/:companyId')
  yearReport(
    @Param('companyId', new ParseIntPipe()) companyId: number,
    @Query() query?: YearReportQueryDTO,
  ) {
    return this.yearReportService.yearReport(companyId, query?.date);
  }

  @Patch('month-data/:companyId/cashflow')
  saveCashflow(
    @Param('companyId', new ParseIntPipe()) companyId: number,
    @Body() body: SaveCashflowDTO,
  ) {
    return this.monthDataService.saveCashflow(companyId, body);
  }

  @Patch('month-data/:companyId')
  upsertMonthData(
    @Param('companyId', new ParseIntPipe()) companyId: number,
    @Body() body: UpdateMonthDataDTO,
  ) {
    return this.monthDataService.upsert(companyId, body);
  }
}
