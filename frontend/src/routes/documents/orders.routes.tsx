import type { RouteObject } from 'react-router-dom';
import { OrdersTable } from '@/components/documents/orders/OrdersTable';

export const ordersRoutes: RouteObject = {
  path: 'orders',
  children: [
    {
      index: true,
      element: <OrdersTable />,
    },
  ],
};
