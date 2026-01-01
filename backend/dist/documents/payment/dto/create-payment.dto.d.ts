import { BasePaymentDTO } from './base-payment.dto';
import { CreatePaymentLineDTO } from './create-payment-line.dto';
export declare class CreatePaymentDTO extends BasePaymentDTO {
    paymentLines: CreatePaymentLineDTO[];
}
