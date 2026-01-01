import { CreateCommissionInvoiceDTO } from './create-commission-invoice.dto';
declare const UpdateCommissionInvoiceDTO_base: import("@nestjs/mapped-types").MappedType<Omit<Partial<CreateCommissionInvoiceDTO>, "buyerId" | "invoiceId">>;
export declare class UpdateCommissionInvoiceDTO extends UpdateCommissionInvoiceDTO_base {
}
export {};
