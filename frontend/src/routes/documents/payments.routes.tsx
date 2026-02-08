import type { RouteObject } from 'react-router-dom';
import { PaymentPage } from '@/components/documents/payments/PaymentPage';
import { PaymentsTable } from '@/components/documents/payments/PaymentsTable';
import { UrlConstants } from '@/constants/url-constants';

export const paymentsRoutes: RouteObject = {
  path: UrlConstants.PAYMENTS_URL,
  children: [
    {
      index: true,
      element: <PaymentsTable />,
    },
    {
      path: ':id',
      element: <PaymentPage />,
    },
  ],
};
