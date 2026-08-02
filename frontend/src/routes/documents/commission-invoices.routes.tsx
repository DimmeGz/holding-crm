import type { RouteObject } from 'react-router-dom';
import {
  CommissionInvoiceCreatePage,
  CommissionInvoiceEditPage,
} from '@/components/documents/commission-invoices/CommissionInvoiceFormPage';
import { CommissionInvoicePage } from '@/components/documents/commission-invoices/CommissionInvoicePage';
import { CommissionInvoicesTable } from '@/components/documents/commission-invoices/CommissionInvoicesTable';
import { UrlConstants } from '@/constants/url-constants';

export const commissionInvoicesRoutes: RouteObject = {
  path: UrlConstants.COMMISSION_INVOICES_URL,
  children: [
    {
      index: true,
      element: <CommissionInvoicesTable />,
    },
    {
      path: 'new',
      element: <CommissionInvoiceCreatePage />,
    },
    {
      path: ':id/edit',
      element: <CommissionInvoiceEditPage />,
    },
    {
      path: ':id',
      element: <CommissionInvoicePage />,
    },
  ],
};
