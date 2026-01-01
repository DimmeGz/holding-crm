import { InvoiceService } from './invoice.service';
import { Invoice } from './entities';
import { CreateInvoiceByContractDTO, CreateInvoiceDTO, UpdateInvoiceDTO } from './dto';
import { GetInvoicesQueryDTO } from './dto/query-dto';
import { GetInvoiceResponseDTO } from './dto/response-dto';
export declare class InvoiceController {
    private readonly invoiceService;
    constructor(invoiceService: InvoiceService);
    getInvoices(query?: GetInvoicesQueryDTO): Promise<Invoice[]>;
    getInvoiceById(invoiceId: number): Promise<GetInvoiceResponseDTO>;
    createInvoice(createInvoiceDTO: CreateInvoiceDTO): Promise<Invoice>;
    createInvoiceByContract(createInvoiceByContractDTO: CreateInvoiceByContractDTO): Promise<Invoice>;
    updateInvoice(invoiceId: number, updateInvoiceDTO: UpdateInvoiceDTO): Promise<Invoice>;
    removeInvoice(invoiceId: number): Promise<Invoice>;
    changeInvoiceStatus(invoiceId: number): Promise<Invoice>;
}
