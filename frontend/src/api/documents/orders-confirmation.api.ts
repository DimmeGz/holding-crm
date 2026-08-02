import { apiClient } from '@/api/api-client';
import type {
  CreateOrderConfirmationPayload,
  OrderConfirmation,
  UpdateOrderConfirmationPayload,
} from '@/types/documents/orders-confirmation.types';

const BASE_URL = '/orders-confirmation';

export const ordersConfirmationApi = {
  getById(confirmationId: number): Promise<OrderConfirmation> {
    return apiClient.get<OrderConfirmation>(`${BASE_URL}/${confirmationId}`);
  },

  create(payload: CreateOrderConfirmationPayload): Promise<OrderConfirmation> {
    return apiClient.post<OrderConfirmation>(BASE_URL, payload);
  },

  update(
    confirmationId: number,
    payload: UpdateOrderConfirmationPayload,
  ): Promise<OrderConfirmation> {
    return apiClient.patch<OrderConfirmation>(
      `${BASE_URL}/${confirmationId}`,
      payload,
    );
  },
};
