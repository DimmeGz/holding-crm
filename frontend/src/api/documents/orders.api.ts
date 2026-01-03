import type { AxiosResponse } from 'axios';
import axios from 'axios';
import { http } from '@/api/http';
import { UrlConstants } from '@/constants/url-constants';
import type { GetOrderDto, GetOrdersDto } from '@/types/documents/orders.types';

export const ordersApi: {
  getList(): Promise<GetOrdersDto[]>;
  getById(orderId: number): Promise<GetOrderDto>;
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

  async getById(orderId: number): Promise<GetOrderDto> {
    try {
      const response: AxiosResponse<GetOrderDto> = await http.get<GetOrderDto>(
        `${UrlConstants.ORDERS_URL}/${orderId}`,
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
