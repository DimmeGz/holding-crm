import type { RouteObject } from 'react-router-dom';
import { CommissionInvoicesTable } from '@/components/documents/commission-invoices/CommissionInvoicesTable';
import { UrlConstants } from '@/constants/url-constants';

export const commissionInvoicesRoutes: RouteObject = {
  path: UrlConstants.COMMISSION_INVOICES_URL,
  children: [
    {
      index: true,
      element: <CommissionInvoicesTable />,
    },
    // {
    //   path: ':id',
    //   element: <CommissionInvoicePage />,
    // },
  ],
};
