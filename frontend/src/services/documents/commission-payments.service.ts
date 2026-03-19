import { commissionPaymentsApi } from '@/api/documents/commission-payments.api';
import type {
  GetCommissionPaymentDto,
  GetCommissionPaymentsDto,
} from '@/types/documents/commission-payments.types';

export class CommissionPaymentsService {
  static async getList(): Promise<GetCommissionPaymentsDto[]> {
    const payments: GetCommissionPaymentsDto[] =
      await commissionPaymentsApi.getList();

    return payments;
  }

  static async getById(
    commissionPaymentId: number,
  ): Promise<GetCommissionPaymentDto> {
    const payment: GetCommissionPaymentDto =
      await commissionPaymentsApi.getById(commissionPaymentId);

    return payment;
  }
}

