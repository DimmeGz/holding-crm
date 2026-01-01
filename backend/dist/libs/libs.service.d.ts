import { TechnicalProcess } from './entities';
import { Repository } from 'typeorm';
export declare class LibsService {
    private readonly technicalProcessesRepository;
    constructor(technicalProcessesRepository: Repository<TechnicalProcess>);
    private createBaseQueryBuilder;
    getTechnicalProcessesByInvoiceIds(invoiceIds: number[]): Promise<TechnicalProcess[]>;
    getTechnicalProcessesByCommissionInvoiceId(commissionInvoiceId: number): Promise<TechnicalProcess[]>;
    getTechnicalProcessesByProductIds(productIds: number[]): Promise<TechnicalProcess[]>;
    getTechnicalProcessesByBatchId(batchId: number): Promise<TechnicalProcess[]>;
}
