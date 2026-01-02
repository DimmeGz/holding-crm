import { ordersApi } from '../api/documents/orders.api';

export type User = {
  id: number;
  name: string;
  email: string;
  displayName: string;
};

export class OrdersService {
  static async getList(): Promise<unknown[]> {
    // 🔒 тут пізніше буде перевірка прав
    const orders = await ordersApi.getList();

    return orders;
  }
}
