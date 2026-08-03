import { paymentsApi } from '@/api/documents/payments.api';
import type { PaymentsListQuery } from '@/helpers/documents-query.helpers';
import type {
  CreatePaymentPayload,
  GetPaymentDto,
  GetPaymentsDto,
  Payment,
  UpdatePaymentPayload,
} from '@/types/documents/payments.types';

export class PaymentsService {
  static async getList(query?: PaymentsListQuery): Promise<GetPaymentsDto[]> {
    return paymentsApi.getList(query);
  }

  static async getByCreationList(): Promise<GetPaymentsDto[]> {
    return paymentsApi.getByCreationList();
  }

  static async getById(paymentId: number): Promise<GetPaymentDto> {
    return paymentsApi.getById(paymentId);
  }

  static async create(payload: CreatePaymentPayload): Promise<Payment> {
    return paymentsApi.create(payload);
  }

  static async update(
    paymentId: number,
    payload: UpdatePaymentPayload,
  ): Promise<Payment> {
    return paymentsApi.update(paymentId, payload);
  }

  static async remove(paymentId: number): Promise<Payment> {
    return paymentsApi.remove(paymentId);
  }

  static async changeStatus(paymentId: number): Promise<Payment> {
    return paymentsApi.changeStatus(paymentId);
  }
}
