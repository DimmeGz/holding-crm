import { CommissionInvoiceService } from './commission-invoice.service';
import { CreateCommissionInvoiceDTO, UpdateCommissionInvoiceDTO } from './dto';
import { CommissionInvoice } from './entities';
export declare class CommissionInvoiceController {
    private readonly commissionInvoiceService;
    constructor(commissionInvoiceService: CommissionInvoiceService);
    getCommissionInvoicess(): Promise<CommissionInvoice[]>;
    getCommissionInvoiceById(commissionId: number): Promise<CommissionInvoice>;
    createCommissionInvoice(createCommissionInvoiceDTO: CreateCommissionInvoiceDTO): Promise<CommissionInvoice>;
    updateCommissionInvoice(commissionId: number, updateCommissionInvoiceDTO: UpdateCommissionInvoiceDTO): Promise<CommissionInvoice>;
    removeCommission(commissionId: number): Promise<CommissionInvoice>;
    changeCommissionStatus(commissionId: number): Promise<CommissionInvoice>;
}
