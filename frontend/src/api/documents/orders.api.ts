import { apiClient } from '@/api/api-client';
import { UrlConstants } from '@/constants/url-constants';
import type {
  CreateOrderPayload,
  GetOrderDto,
  GetOrdersDto,
  GetOrdersQuery,
  Order,
  UpdateOrderPayload,
} from '@/types/documents/orders.types';

function buildOrdersQueryString(query?: GetOrdersQuery): string {
  if (!query) {
    return '';
  }

  const params = new URLSearchParams();

  if (query.status !== undefined) {
    params.set('status', String(query.status));
  }

  if (query.hidden !== undefined) {
    params.set('hidden', String(query.hidden));
  }

  if (query.sellerId !== undefined) {
    params.set('sellerId', String(query.sellerId));
  }

  if (query.buyerId !== undefined) {
    params.set('buyerId', String(query.buyerId));
  }

  if (query.recipientId !== undefined) {
    params.set('recipientId', String(query.recipientId));
  }

  if (query.year !== undefined) {
    params.set('year', String(query.year));
  }

  if (query.type !== undefined) {
    params.set('type', query.type);
  }

  if (query.process !== undefined) {
    params.set('process', String(query.process));
  }

  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export const ordersApi = {
  getList(query?: GetOrdersQuery): Promise<GetOrdersDto[]> {
    return apiClient.get<GetOrdersDto[]>(
      `${UrlConstants.ORDERS_URL}${buildOrdersQueryString(query)}`,
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
