import { AbstractDocumentEntity } from '../../entities';
import { TechnicalProcess } from '../../../libs/entities';
import { PaymentLine } from './payment-line.entity';
export declare class Payment extends AbstractDocumentEntity<Payment> {
    documentSum: number;
    status: boolean;
    expectedDate: Date;
    technicalProcesses: TechnicalProcess[];
    paymentLines: Partial<PaymentLine>[];
}
