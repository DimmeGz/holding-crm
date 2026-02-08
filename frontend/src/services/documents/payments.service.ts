import { paymentsApi } from '@/api/documents/payments.api';
import type {
  GetPaymentDto,
  GetPaymentsDto,
} from '@/types/documents/payments.types';

export class PaymentsService {
  static async getList(): Promise<GetPaymentsDto[]> {
    const invoices: GetPaymentsDto[] = await paymentsApi.getList();

    return invoices;
  }

  static async getById(paymentId: number): Promise<GetPaymentDto> {
    const payment: GetPaymentDto = await paymentsApi.getById(paymentId);

    return payment;
  }
}
