import { ordersApi } from '@/api/documents/orders.api';
import type { GetOrderDto, GetOrdersDto, Order } from '@/types/documents/orders.types';

export class OrdersService {
  static async getList(): Promise<GetOrdersDto[]> {
    return ordersApi.getList();
  }

  static async getById(orderId: number): Promise<GetOrderDto> {
    return ordersApi.getById(orderId);
  }

  static async remove(orderId: number): Promise<Order> {
    return ordersApi.remove(orderId);
  }

  static async changeStatus(orderId: number): Promise<Order> {
    return ordersApi.changeStatus(orderId);
  }
}
