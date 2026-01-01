import { AbstractDocumentEntity } from '../../entities';
import { Invoice } from '../../invoice/entities';
import { TechnicalProcess } from '../../../libs/entities';
import { CommissionPayment } from '../../commission-payment/entities';
export declare class CommissionInvoice extends AbstractDocumentEntity<CommissionInvoice> {
    documentSum: number;
    paymentBalance: number;
    creationDate: Date;
    invoice: Invoice;
    invoiceId: number;
    rate: number;
    technicalProcesses: Partial<TechnicalProcess>[];
    commissionPayments: Partial<CommissionPayment>[];
}
