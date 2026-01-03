import type { RouteObject } from 'react-router-dom';
import { OrdersList } from '@/components/documents/orders/OrdersList';

export const ordersRoutes: RouteObject = {
  path: 'orders',
  children: [
    {
      index: true,
      element: <OrdersList />,
    },
  ],
};
