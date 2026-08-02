import type { RouteObject } from 'react-router-dom';
import {
  PaymentCreatePage,
  PaymentEditPage,
} from '@/components/documents/payments/PaymentFormPage';
import { PaymentPage } from '@/components/documents/payments/PaymentPage';
import { PaymentsByCreationTable } from '@/components/documents/payments/PaymentsByCreationTable';
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
      path: 'by-creation',
      element: <PaymentsByCreationTable />,
    },
    {
      path: 'new',
      element: <PaymentCreatePage />,
    },
    {
      path: ':id/edit',
      element: <PaymentEditPage />,
    },
    {
      path: ':id',
      element: <PaymentPage />,
    },
  ],
};
