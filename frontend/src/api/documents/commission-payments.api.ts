import { apiClient } from '@/api/api-client';
import { UrlConstants } from '@/constants/url-constants';
import type {
  CreateCommissionPaymentPayload,
  GetCommissionPaymentDto,
  GetCommissionPaymentsDto,
  UpdateCommissionPaymentPayload,
} from '@/types/documents/commission-payments.types';

export const commissionPaymentsApi = {
  getList(): Promise<GetCommissionPaymentsDto[]> {
    return apiClient.get<GetCommissionPaymentsDto[]>(
      UrlConstants.COMMISSION_PAYMENTS_URL,
    );
  },

  getById(commissionPaymentId: number): Promise<GetCommissionPaymentDto> {
    return apiClient.get<GetCommissionPaymentDto>(
      `${UrlConstants.COMMISSION_PAYMENTS_URL}/${commissionPaymentId}`,
    );
  },

  create(
    payload: CreateCommissionPaymentPayload,
  ): Promise<GetCommissionPaymentDto> {
    return apiClient.post<GetCommissionPaymentDto>(
      UrlConstants.COMMISSION_PAYMENTS_URL,
      payload,
    );
  },

  update(
    commissionPaymentId: number,
    payload: UpdateCommissionPaymentPayload,
  ): Promise<GetCommissionPaymentDto> {
    return apiClient.patch<GetCommissionPaymentDto>(
      `${UrlConstants.COMMISSION_PAYMENTS_URL}/${commissionPaymentId}`,
      payload,
    );
  },

  remove(commissionPaymentId: number): Promise<GetCommissionPaymentDto> {
    return apiClient.del<GetCommissionPaymentDto>(
      `${UrlConstants.COMMISSION_PAYMENTS_URL}/${commissionPaymentId}`,
    );
  },

  changeStatus(
    commissionPaymentId: number,
  ): Promise<GetCommissionPaymentDto> {
    return apiClient.patch<GetCommissionPaymentDto>(
      `${UrlConstants.COMMISSION_PAYMENTS_URL}/change-status/${commissionPaymentId}`,
    );
  },
};
