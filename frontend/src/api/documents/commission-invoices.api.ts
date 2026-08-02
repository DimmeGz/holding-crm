import { apiClient } from '@/api/api-client';
import { UrlConstants } from '@/constants/url-constants';
import type {
  CreateCommissionInvoicePayload,
  GetCommissionInvoiceDto,
  GetCommissionInvoicesDto,
  UpdateCommissionInvoicePayload,
} from '@/types/documents/commission-invoices.types';

export const commissionInvoicesApi = {
  getList(): Promise<GetCommissionInvoicesDto[]> {
    return apiClient.get<GetCommissionInvoicesDto[]>(
      UrlConstants.COMMISSION_INVOICES_URL,
    );
  },

  getById(commissionInvoiceId: number): Promise<GetCommissionInvoiceDto> {
    return apiClient.get<GetCommissionInvoiceDto>(
      `${UrlConstants.COMMISSION_INVOICES_URL}/${commissionInvoiceId}`,
    );
  },

  create(
    payload: CreateCommissionInvoicePayload,
  ): Promise<GetCommissionInvoiceDto> {
    return apiClient.post<GetCommissionInvoiceDto>(
      UrlConstants.COMMISSION_INVOICES_URL,
      payload,
    );
  },

  update(
    commissionInvoiceId: number,
    payload: UpdateCommissionInvoicePayload,
  ): Promise<GetCommissionInvoiceDto> {
    return apiClient.patch<GetCommissionInvoiceDto>(
      `${UrlConstants.COMMISSION_INVOICES_URL}/${commissionInvoiceId}`,
      payload,
    );
  },

  remove(commissionInvoiceId: number): Promise<GetCommissionInvoiceDto> {
    return apiClient.del<GetCommissionInvoiceDto>(
      `${UrlConstants.COMMISSION_INVOICES_URL}/${commissionInvoiceId}`,
    );
  },

  changeStatus(commissionInvoiceId: number): Promise<GetCommissionInvoiceDto> {
    return apiClient.patch<GetCommissionInvoiceDto>(
      `${UrlConstants.COMMISSION_INVOICES_URL}/change-status/${commissionInvoiceId}`,
    );
  },
};
