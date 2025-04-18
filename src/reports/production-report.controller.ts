import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ProductionReportService } from './production-report.service';
import { ProductionReportQueryDTO } from './dto/query-dto';

@Controller('reports')
export class ProductionReportController {
  constructor(
    private readonly productionReportService: ProductionReportService,
  ) {}

  @Get('production-report/:companyId')
  productionReport(
    @Param('companyId', new ParseIntPipe()) companyId: number,
    @Query() query?: ProductionReportQueryDTO,
  ) {
    return this.productionReportService.productionReport(companyId, query);
  }
}
