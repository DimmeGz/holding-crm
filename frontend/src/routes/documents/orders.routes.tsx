import type { RouteObject } from 'react-router-dom';
import { OrderChoicesPage } from '@/components/documents/orders/OrderChoicesPage';
import {
  OrderConfirmationCreatePage,
  OrderConfirmationEditPage,
} from '@/components/documents/orders/OrderConfirmationFormPage';
import {
  OrderCreatePage,
  OrderEditPage,
} from '@/components/documents/orders/OrderFormPage';
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
      path: 'new',
      element: <OrderCreatePage />,
    },
    {
      path: 'choices',
      element: <OrderChoicesPage />,
    },
    {
      path: ':id/confirmation/new',
      element: <OrderConfirmationCreatePage />,
    },
    {
      path: ':id/confirmation/edit',
      element: <OrderConfirmationEditPage />,
    },
    {
      path: ':id/edit',
      element: <OrderEditPage />,
    },
    {
      path: ':id',
      element: <OrderPage />,
    },
  ],
};
