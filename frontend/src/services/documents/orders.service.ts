import { ordersApi } from '@/api/documents/orders.api';
import type {
  CreateOrderPayload,
  GetOrderDto,
  GetOrdersDto,
  GetOrdersQuery,
  Order,
  UpdateOrderPayload,
} from '@/types/documents/orders.types';

export class OrdersService {
  static async getList(query?: GetOrdersQuery): Promise<GetOrdersDto[]> {
    return ordersApi.getList(query);
  }

  static async getById(orderId: number): Promise<GetOrderDto> {
    return ordersApi.getById(orderId);
  }

  static async create(payload: CreateOrderPayload): Promise<Order> {
    return ordersApi.create(payload);
  }

  static async update(
    orderId: number,
    payload: UpdateOrderPayload,
  ): Promise<Order> {
    return ordersApi.update(orderId, payload);
  }

  static async remove(orderId: number): Promise<Order> {
    return ordersApi.remove(orderId);
  }

  static async changeStatus(orderId: number): Promise<Order> {
    return ordersApi.changeStatus(orderId);
  }
}
