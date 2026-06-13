import { apiClient } from '@/api/api-client';
import { UrlConstants } from '@/constants/url-constants';
import type { GetOrderDto, GetOrdersDto, Order } from '@/types/documents/orders.types';

export const ordersApi = {
  getList(): Promise<GetOrdersDto[]> {
    return apiClient.get<GetOrdersDto[]>(UrlConstants.ORDERS_URL);
  },

  getById(orderId: number): Promise<GetOrderDto> {
    return apiClient.get<GetOrderDto>(`${UrlConstants.ORDERS_URL}/${orderId}`);
  },

  remove(orderId: number): Promise<Order> {
    return apiClient.del<Order>(`${UrlConstants.ORDERS_URL}/${orderId}`);
  },

  changeStatus(orderId: number): Promise<Order> {
    return apiClient.patch<Order>(
      `${UrlConstants.ORDERS_URL}/change-status/${orderId}`,
    );
  },
};
