import type { RouteObject } from 'react-router-dom';
import { OrderPage } from '@/components/documents/orders/OrderPage';
import { OrdersTable } from '@/components/documents/orders/OrdersTable';

export const ordersRoutes: RouteObject = {
  path: 'orders',
  children: [
    {
      index: true,
      element: <OrdersTable />,
    },
    {
      path: ':id',
      element: <OrderPage />,
    },
  ],
};
