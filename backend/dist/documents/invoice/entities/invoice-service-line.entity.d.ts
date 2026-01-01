import { AbstractServiceLineEntity } from '../../entities';
import { Invoice } from './invoice.entity';
import { Service } from '../../../goods/entities';
export declare class InvoiceServiceLine extends AbstractServiceLineEntity {
    invoice: Invoice;
    service: Service;
    serviceId: number;
}
