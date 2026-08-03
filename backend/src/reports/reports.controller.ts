import {
  Body,
  Controller,
  Get,
  Header,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  StreamableFile,
} from '@nestjs/common';

import { ProductionReportService } from './production-report.service';
import { MonthReportService } from './month-report.service';
import { MonthDataService } from './month-data.service';
import { YearReportService } from './year-report.service';
import { TechnoReportService } from './techno-report.service';
import {
  ReportQueryDTO,
  TechnoReportQueryDTO,
  YearReportQueryDTO,
} from './dto/query-dto';
import { UpdateMonthDataDTO } from './dto/update-month-data.dto';
import { SaveCashflowDTO } from './dto/save-cashflow.dto';
import {
  buildCsvFilename,
  serializeMonthReportCsv,
} from './helpers';

@Controller('reports')
export class ReportsController {
  constructor(
    private readonly monthReportService: MonthReportService,
    private readonly monthDataService: MonthDataService,
    private readonly yearReportService: YearReportService,
    private readonly productionReportService: ProductionReportService,
    private readonly technoReportService: TechnoReportService,
  ) {}

  @Get('production-report/:companyId')
  productionReport(
    @Param('companyId', new ParseIntPipe()) companyId: number,
    @Query() query?: ReportQueryDTO,
  ) {
    return this.productionReportService.productionReport(companyId, query);
  }

  @Get('techno-report')
  technoReport(@Query() query: TechnoReportQueryDTO) {
    return this.technoReportService.technoReport(query);
  }

  @Get('month-report/:companyId/export')
  @Header('Content-Type', 'text/csv; charset=utf-8')
  async exportMonthReport(
    @Param('companyId', new ParseIntPipe()) companyId: number,
    @Query() query?: ReportQueryDTO,
  ): Promise<StreamableFile> {
    const report = await this.monthReportService.monthReport(companyId, query);
    const csv = serializeMonthReportCsv(report);
    const filename = buildCsvFilename(report.company.name, report.date);
    return new StreamableFile(Buffer.from(csv, 'utf-8'), {
      type: 'text/csv; charset=utf-8',
      disposition: `attachment; filename="${filename}"`,
    });
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
