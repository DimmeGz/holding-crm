import { apiClient } from '@/api/api-client';
import { UrlConstants } from '@/constants/url-constants';
import type {
  CreateInvoiceByContractPayload,
  CreateInvoicePayload,
  GetInvoiceDto,
  GetInvoicesDto,
  Invoice,
  UpdateInvoicePayload,
} from '@/types/documents/invoices.types';

export const invoicesApi = {
  getList(): Promise<GetInvoicesDto[]> {
    return apiClient.get<GetInvoicesDto[]>(UrlConstants.INVOICES_URL);
  },

  getById(invoiceId: number): Promise<GetInvoiceDto> {
    return apiClient.get<GetInvoiceDto>(
      `${UrlConstants.INVOICES_URL}/${invoiceId}`,
    );
  },

  create(payload: CreateInvoicePayload): Promise<Invoice> {
    return apiClient.post<Invoice>(UrlConstants.INVOICES_URL, payload);
  },

  createByContract(payload: CreateInvoiceByContractPayload): Promise<Invoice> {
    return apiClient.post<Invoice>(
      `${UrlConstants.INVOICES_URL}/by-contract`,
      payload,
    );
  },

  update(invoiceId: number, payload: UpdateInvoicePayload): Promise<Invoice> {
    return apiClient.patch<Invoice>(
      `${UrlConstants.INVOICES_URL}/${invoiceId}`,
      payload,
    );
  },

  remove(invoiceId: number): Promise<Invoice> {
    return apiClient.del<Invoice>(`${UrlConstants.INVOICES_URL}/${invoiceId}`);
  },

  changeStatus(invoiceId: number): Promise<Invoice> {
    return apiClient.patch<Invoice>(
      `${UrlConstants.INVOICES_URL}/change-status/${invoiceId}`,
    );
  },
};
