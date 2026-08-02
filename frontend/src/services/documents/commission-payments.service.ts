import { commissionPaymentsApi } from '@/api/documents/commission-payments.api';
import type {
  CreateCommissionPaymentPayload,
  GetCommissionPaymentDto,
  GetCommissionPaymentsDto,
  UpdateCommissionPaymentPayload,
} from '@/types/documents/commission-payments.types';

export class CommissionPaymentsService {
  static async getList(): Promise<GetCommissionPaymentsDto[]> {
    return commissionPaymentsApi.getList();
  }

  static async getById(
    commissionPaymentId: number,
  ): Promise<GetCommissionPaymentDto> {
    return commissionPaymentsApi.getById(commissionPaymentId);
  }

  static async create(
    payload: CreateCommissionPaymentPayload,
  ): Promise<GetCommissionPaymentDto> {
    return commissionPaymentsApi.create(payload);
  }

  static async update(
    commissionPaymentId: number,
    payload: UpdateCommissionPaymentPayload,
  ): Promise<GetCommissionPaymentDto> {
    return commissionPaymentsApi.update(commissionPaymentId, payload);
  }

  static async remove(
    commissionPaymentId: number,
  ): Promise<GetCommissionPaymentDto> {
    return commissionPaymentsApi.remove(commissionPaymentId);
  }

  static async changeStatus(
    commissionPaymentId: number,
  ): Promise<GetCommissionPaymentDto> {
    return commissionPaymentsApi.changeStatus(commissionPaymentId);
  }
}
