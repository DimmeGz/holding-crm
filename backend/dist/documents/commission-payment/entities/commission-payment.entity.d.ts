import { AbstractDocumentEntity } from '../../entities';
import { CommissionInvoice } from '../../commission-invoice/entities';
import { TechnicalProcess } from '../../../libs/entities';
export declare class CommissionPayment extends AbstractDocumentEntity<CommissionPayment> {
    commissionInvoice: CommissionInvoice;
    commissionInvoiceId: number;
    expectedDate: Date;
    amount: number;
    technicalProcesses: TechnicalProcess[];
}
