import { BaseInvoiceDTO } from './base-invoice.dto';
import { CreateInvoiceLineDTO } from './create-invoice-line.dto';
import { CreateServiceLineDTO, UpdateServiceLineDTO } from '../../common/dto';
import { UpdateInvoiceLineDTO } from './update-invoice-line.dto';
export declare class UpdateInvoiceDTO extends BaseInvoiceDTO {
    invoiceLines: (CreateInvoiceLineDTO | UpdateInvoiceLineDTO)[];
    invoiceServiceLines: (CreateServiceLineDTO | UpdateServiceLineDTO)[];
}
