import type { AxiosResponse } from 'axios';
import axios from 'axios';
import { http } from '@/api/http';
import { UrlConstants } from '@/constants/url-constants';
import type { GetOrdersDto } from '@/types/documents/orders.types';

export const ordersApi: {
  getList(): Promise<GetOrdersDto[]>;
} = {
  async getList(): Promise<GetOrdersDto[]> {
    try {
      const response: AxiosResponse<GetOrdersDto[]> = await http.get<
        GetOrdersDto[]
      >(UrlConstants.ORDERS_URL);

      return response.data;
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        throw new Error(e.message);
      }

      throw new Error('An unexpected error occurred');
    }
  },
};
