import type { RouteObject } from 'react-router-dom';
import {
  CommissionPaymentCreatePage,
  CommissionPaymentEditPage,
} from '@/components/documents/commission-payments/CommissionPaymentFormPage';
import { CommissionPaymentPage } from '@/components/documents/commission-payments/CommissionPaymentPage';
import { CommissionPaymentsTable } from '@/components/documents/commission-payments/CommissionPaymentsTable';
import { UrlConstants } from '@/constants/url-constants';

export const commissionPaymentsRoutes: RouteObject = {
  path: UrlConstants.COMMISSION_PAYMENTS_URL,
  children: [
    {
      index: true,
      element: <CommissionPaymentsTable />,
    },
    {
      path: 'new',
      element: <CommissionPaymentCreatePage />,
    },
    {
      path: ':id/edit',
      element: <CommissionPaymentEditPage />,
    },
    {
      path: ':id',
      element: <CommissionPaymentPage />,
    },
  ],
};
