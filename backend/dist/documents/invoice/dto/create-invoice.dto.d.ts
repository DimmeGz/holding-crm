import { BaseInvoiceDTO } from './base-invoice.dto';
import { CreateInvoiceLineDTO } from './create-invoice-line.dto';
import { CreateServiceLineDTO } from '../../common/dto';
export declare class CreateInvoiceDTO extends BaseInvoiceDTO {
    invoiceLines: CreateInvoiceLineDTO[];
    invoiceServiceLines: CreateServiceLineDTO[];
}
