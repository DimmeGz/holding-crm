import { PaymentLine } from '../../payment/entities';
export declare class UpdatePaymentBalanceDTO {
    status: boolean;
    paymentLines: Partial<PaymentLine>[];
}
