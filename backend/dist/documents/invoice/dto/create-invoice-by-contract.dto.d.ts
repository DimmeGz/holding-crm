import { BaseInvoiceDTO } from './base-invoice.dto';
import { CreateInvoiceLineByContractDTO } from './create-invoice-line-by-contract.dto';
import { CreateServiceLineDTO } from '../../common/dto';
export declare class CreateInvoiceByContractDTO extends BaseInvoiceDTO {
    contractId: number;
    invoiceLines: CreateInvoiceLineByContractDTO[];
    invoiceServiceLines: CreateServiceLineDTO[];
}
