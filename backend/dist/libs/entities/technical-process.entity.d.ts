import { AbstractEntity } from '../../common/entities';
import { Product, Service } from '../../goods/entities';
import { Invoice } from '../../documents/invoice/entities';
import { CommissionInvoice } from '../../documents/commission-invoice/entities';
export declare class TechnicalProcess extends AbstractEntity {
    name: string;
    products: Product[];
    services: Service[];
    invoices: Invoice[];
    commissionInvoices: CommissionInvoice[];
}
