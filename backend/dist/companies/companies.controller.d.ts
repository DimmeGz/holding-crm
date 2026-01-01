import { CompaniesService } from './companies.service';
import { Company } from './entities';
export declare class CompaniesController {
    private readonly companiesService;
    constructor(companiesService: CompaniesService);
    getCompanies(): Promise<Company[]>;
    getCompanyById(companyId: number): Promise<Company>;
}
