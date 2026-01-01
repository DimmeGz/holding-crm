import { Repository } from 'typeorm';
import { CompaniesService } from '../../companies';
import { InvoiceService } from '../invoice';
import { CommissionInvoice } from './entities';
import { CreateCommissionInvoiceDTO, UpdateCommissionInvoiceDTO } from './dto';
export declare class CommissionInvoiceService {
    private readonly commissionRepository;
    private readonly invoicesService;
    private readonly companiesService;
    constructor(commissionRepository: Repository<CommissionInvoice>, invoicesService: InvoiceService, companiesService: CompaniesService);
    private createBaseQueryBuilder;
    private applyBaseSelect;
    getCommissionInvoicess(): Promise<CommissionInvoice[]>;
    getCommissionInvoiceById(commissionId: number): Promise<CommissionInvoice>;
    createCommissionInvoice(createCommissionInvoiceDTO: CreateCommissionInvoiceDTO): Promise<CommissionInvoice>;
    updateCommissionInvoice(commissionId: number, updateCommissionInvoiceDTO: UpdateCommissionInvoiceDTO): Promise<CommissionInvoice>;
    private calculateAndSetDocumentSumAndBalance;
    removeCommission(commissionId: number): Promise<CommissionInvoice>;
    changeCommissionStatus(commissionId: number): Promise<CommissionInvoice>;
}
