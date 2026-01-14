import { ordersApi } from '@/api/documents/orders.api';
import type { GetOrderDto, GetOrdersDto } from '@/types/documents/orders.types';

export type User = {
  id: number;
  name: string;
  email: string;
  displayName: string;
};

export class OrdersService {
  static async getList(): Promise<GetOrdersDto[]> {
    const orders: GetOrdersDto[] = await ordersApi.getList();

    return orders;
  }

  static async getById(orderId: number): Promise<GetOrderDto> {
    const order: GetOrderDto = await ordersApi.getById(orderId);

    return order;
  }
}
