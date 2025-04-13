import { PaymentLine } from '../../payment/entities';

export class UpdatePaymentBalanceDTO {
  status: boolean;
  paymentLines: Partial<PaymentLine>[];
}
