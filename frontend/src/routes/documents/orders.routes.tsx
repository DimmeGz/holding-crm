import type { RouteObject } from 'react-router-dom';
import { OrderPage } from '@/components/documents/orders/OrderPage';
import { OrdersTable } from '@/components/documents/orders/OrdersTable';
import { UrlConstants } from '@/constants/url-constants';

export const ordersRoutes: RouteObject = {
  path: UrlConstants.ORDERS_URL,
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
