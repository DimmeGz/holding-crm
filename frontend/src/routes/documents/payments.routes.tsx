import type { RouteObject } from 'react-router-dom';
import { PaymentsTable } from '@/components/documents/payments/PaymentsTable';
import { UrlConstants } from '@/constants/url-constants';

export const paymentsRoutes: RouteObject = {
  path: UrlConstants.PAYMENTS_URL,
  children: [
    {
      index: true,
      element: <PaymentsTable />,
    },
    // {
    //   path: ':id',
    //   element: <InvoicePage />,
    // },
  ],
};
