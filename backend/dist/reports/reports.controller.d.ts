import { ProductionReportService } from './production-report.service';
import { MonthReportService } from './month-report.service';
import { ReportQueryDTO } from './dto/query-dto';
export declare class ReportsController {
    private readonly monthReportService;
    private readonly productionReportService;
    constructor(monthReportService: MonthReportService, productionReportService: ProductionReportService);
    productionReport(companyId: number, query?: ReportQueryDTO): Promise<import("./dto/response-dto").ProductionReportResponseDTO>;
    monthReport(companyId: number, query?: ReportQueryDTO): Promise<any>;
}
