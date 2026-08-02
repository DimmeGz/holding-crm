import { apiClient } from '@/api/api-client';
import { UrlConstants } from '@/constants/url-constants';
import type {
  CreatePaymentPayload,
  GetPaymentDto,
  GetPaymentsDto,
  Payment,
  UpdatePaymentPayload,
} from '@/types/documents/payments.types';

export const paymentsApi = {
  getList(): Promise<GetPaymentsDto[]> {
    return apiClient.get<GetPaymentsDto[]>(UrlConstants.PAYMENTS_URL);
  },

  getByCreationList(): Promise<GetPaymentsDto[]> {
    return apiClient.get<GetPaymentsDto[]>(
      `${UrlConstants.PAYMENTS_URL}/by-creation`,
    );
  },

  getById(paymentId: number): Promise<GetPaymentDto> {
    return apiClient.get<GetPaymentDto>(
      `${UrlConstants.PAYMENTS_URL}/${paymentId}`,
    );
  },

  create(payload: CreatePaymentPayload): Promise<Payment> {
    return apiClient.post<Payment>(UrlConstants.PAYMENTS_URL, payload);
  },

  update(paymentId: number, payload: UpdatePaymentPayload): Promise<Payment> {
    return apiClient.patch<Payment>(
      `${UrlConstants.PAYMENTS_URL}/${paymentId}`,
      payload,
    );
  },

  remove(paymentId: number): Promise<Payment> {
    return apiClient.del<Payment>(`${UrlConstants.PAYMENTS_URL}/${paymentId}`);
  },

  changeStatus(paymentId: number): Promise<Payment> {
    return apiClient.patch<Payment>(
      `${UrlConstants.PAYMENTS_URL}/change-status/${paymentId}`,
    );
  },
};
