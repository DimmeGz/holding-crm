import { AbstractEntity } from '../../../common/entities';
import { Payment } from './payment.entity';
import { Invoice } from '../../invoice/entities';
export declare class PaymentLine extends AbstractEntity {
    payment: Payment;
    invoice: Invoice;
    invoiceId: number;
    amount: number;
}
