import { apiClient } from '@/api/api-client';
import { UrlConstants } from '@/constants/url-constants';
import { buildDocumentsQueryString } from '@/helpers/documents-query.helpers';
import type {
  CreateOrderPayload,
  GetOrderDto,
  GetOrdersDto,
  GetOrdersQuery,
  Order,
  UpdateOrderPayload,
} from '@/types/documents/orders.types';

export const ordersApi = {
  getList(query?: GetOrdersQuery): Promise<GetOrdersDto[]> {
    return apiClient.get<GetOrdersDto[]>(
      `${UrlConstants.ORDERS_URL}${buildDocumentsQueryString(query)}`,
    );
  },

  getById(orderId: number): Promise<GetOrderDto> {
    return apiClient.get<GetOrderDto>(`${UrlConstants.ORDERS_URL}/${orderId}`);
  },

  create(payload: CreateOrderPayload): Promise<Order> {
    return apiClient.post<Order>(UrlConstants.ORDERS_URL, payload);
  },

  update(orderId: number, payload: UpdateOrderPayload): Promise<Order> {
    return apiClient.patch<Order>(
      `${UrlConstants.ORDERS_URL}/${orderId}`,
      payload,
    );
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
