import { ordersConfirmationApi } from '@/api/documents/orders-confirmation.api';
import type {
  CreateOrderConfirmationPayload,
  OrderConfirmation,
  UpdateOrderConfirmationPayload,
} from '@/types/documents/orders-confirmation.types';

export class OrdersConfirmationService {
  static async getById(confirmationId: number): Promise<OrderConfirmation> {
    return ordersConfirmationApi.getById(confirmationId);
  }

  static async create(
    payload: CreateOrderConfirmationPayload,
  ): Promise<OrderConfirmation> {
    return ordersConfirmationApi.create(payload);
  }

  static async update(
    confirmationId: number,
    payload: UpdateOrderConfirmationPayload,
  ): Promise<OrderConfirmation> {
    return ordersConfirmationApi.update(confirmationId, payload);
  }
}
