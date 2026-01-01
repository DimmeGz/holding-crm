import { CreateInvoiceLineDTO } from './create-invoice-line.dto';
export declare class UpdateInvoiceLineDTO extends CreateInvoiceLineDTO {
    id: number;
    remove?: boolean;
}
