import { Account, Company } from './entities';
import { Repository } from 'typeorm';
import { ChangeInvoiceStatusBalanceDTO, MakePaymentDTO } from './dto';
export declare class CompaniesService {
    private readonly companiesRepository;
    private readonly accountsRepository;
    constructor(companiesRepository: Repository<Company>, accountsRepository: Repository<Account>);
    private createBaseCompanyQueryBuilder;
    private applyCompanyListSelect;
    private createBaseAccountQueryBuilder;
    getCompanies(): Promise<Company[]>;
    private getSellerBuyerAccounts;
    changeInvoiceStatusBalances(dto: ChangeInvoiceStatusBalanceDTO): Promise<void>;
    changeAccountsBalances(dto: MakePaymentDTO): Promise<void>;
    getCompanyById(companyId: number): Promise<Company>;
}
