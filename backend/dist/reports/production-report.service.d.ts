import { Repository } from 'typeorm';
import { Company } from '../companies/entities';
import { ReportQueryDTO } from './dto/query-dto';
import { ProductionReportResponseDTO } from './dto/response-dto';
export declare class ProductionReportService {
    private readonly companiesRepository;
    constructor(companiesRepository: Repository<Company>);
    productionReport(companyId: number, query?: ReportQueryDTO): Promise<ProductionReportResponseDTO>;
}
