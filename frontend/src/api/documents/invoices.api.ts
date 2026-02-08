import type { AxiosResponse } from 'axios';
import axios from 'axios';
import { http } from '@/api/http';
import { UrlConstants } from '@/constants/url-constants';
import type {
  GetInvoiceDto,
  GetInvoicesDto,
} from '@/types/documents/invoices.types';

export const invoicesApi: {
  getList(): Promise<GetInvoicesDto[]>;
  getById(invoiceId: number): Promise<GetInvoiceDto>;
} = {
  async getList(): Promise<GetInvoicesDto[]> {
    try {
      const response: AxiosResponse<GetInvoicesDto[]> = await http.get<
        GetInvoicesDto[]
      >(UrlConstants.INVOICES_URL);

      return response.data;
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        throw new Error(e.message);
      }

      throw new Error('An unexpected error occurred');
    }
  },

  async getById(invoiceId: number): Promise<GetInvoiceDto> {
    try {
      const response: AxiosResponse<GetInvoiceDto> =
        await http.get<GetInvoiceDto>(
          `${UrlConstants.INVOICES_URL}/${invoiceId}`,
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
