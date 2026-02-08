import type { AxiosResponse } from 'axios';
import axios from 'axios';
import { http } from '@/api/http';
import { UrlConstants } from '@/constants/url-constants';
import type {
  GetCommissionInvoiceDto,
  GetCommissionInvoicesDto,
} from '@/types/documents/commission-invoices.types';

export const commissionInvoicesApi: {
  getList(): Promise<GetCommissionInvoicesDto[]>;
  getById(commissionInvoiceId: number): Promise<GetCommissionInvoiceDto>;
} = {
  async getList(): Promise<GetCommissionInvoicesDto[]> {
    try {
      const response: AxiosResponse<GetCommissionInvoicesDto[]> =
        await http.get<GetCommissionInvoicesDto[]>(
          UrlConstants.COMMISSION_INVOICES_URL,
        );

      return response.data;
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        throw new Error(e.message);
      }

      throw new Error('An unexpected error occurred');
    }
  },

  async getById(commissionInvoiceId: number): Promise<GetCommissionInvoiceDto> {
    try {
      const response: AxiosResponse<GetCommissionInvoiceDto> =
        await http.get<GetCommissionInvoiceDto>(
          `${UrlConstants.COMMISSION_INVOICES_URL}/${commissionInvoiceId}`,
        );

      return response.data;
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        throw new Error(e.message);
      }

      throw new Error('An unexpected error occurred');
    }
  },
};
