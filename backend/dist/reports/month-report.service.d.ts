import { Repository } from 'typeorm';
import { Invoice } from '../documents/invoice/entities';
import { Company } from '../companies/entities';
import { ReportQueryDTO } from './dto/query-dto';
export declare class MonthReportService {
    private readonly companiesRepository;
    private readonly invoicesRepository;
    constructor(companiesRepository: Repository<Company>, invoicesRepository: Repository<Invoice>);
    private readonly REPORT_TYPE_DICT;
    monthReport(companyId: number, query?: ReportQueryDTO): Promise<any>;
    private getReportType1;
    private getInvoices;
}
