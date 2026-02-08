import type { AxiosResponse } from 'axios';
import axios from 'axios';
import { http } from '@/api/http';
import { UrlConstants } from '@/constants/url-constants';
import type {
  GetPaymentDto,
  GetPaymentsDto,
} from '@/types/documents/payments.types';

export const paymentsApi: {
  getList(): Promise<GetPaymentsDto[]>;
  getById(contractId: number): Promise<GetPaymentDto>;
} = {
  async getList(): Promise<GetPaymentsDto[]> {
    try {
      const response: AxiosResponse<GetPaymentsDto[]> = await http.get<
        GetPaymentsDto[]
      >(UrlConstants.PAYMENTS_URL);

      return response.data;
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        throw new Error(e.message);
      }

      throw new Error('An unexpected error occurred');
    }
  },

  async getById(paymentId: number): Promise<GetPaymentDto> {
    try {
      const response: AxiosResponse<GetPaymentDto> =
        await http.get<GetPaymentDto>(
          `${UrlConstants.PAYMENTS_URL}/${paymentId}`,
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
