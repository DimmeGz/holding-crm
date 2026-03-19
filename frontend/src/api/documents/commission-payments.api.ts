import type { AxiosResponse } from 'axios';
import axios from 'axios';
import { http } from '@/api/http';
import { UrlConstants } from '@/constants/url-constants';
import type {
  GetCommissionPaymentDto,
  GetCommissionPaymentsDto,
} from '@/types/documents/commission-payments.types';

export const commissionPaymentsApi: {
  getList(): Promise<GetCommissionPaymentsDto[]>;
  getById(commissionPaymentId: number): Promise<GetCommissionPaymentDto>;
} = {
  async getList(): Promise<GetCommissionPaymentsDto[]> {
    try {
      const response: AxiosResponse<GetCommissionPaymentsDto[]> = await http.get<
        GetCommissionPaymentsDto[]
      >(UrlConstants.COMMISSION_PAYMENTS_URL);

      return response.data;
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        throw new Error(e.message);
      }

      throw new Error('An unexpected error occurred');
    }
  },

  async getById(
    commissionPaymentId: number,
  ): Promise<GetCommissionPaymentDto> {
    try {
      const response: AxiosResponse<GetCommissionPaymentDto> =
        await http.get<GetCommissionPaymentDto>(
          `${UrlConstants.COMMISSION_PAYMENTS_URL}/${commissionPaymentId}`,
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

