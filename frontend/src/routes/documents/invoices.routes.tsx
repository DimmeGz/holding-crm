import type { RouteObject } from 'react-router-dom';
import { InvoicePage } from '@/components/documents/invoices/InvoicePage';
import { InvoicesTable } from '@/components/documents/invoices/InvoicesTable';
import { UrlConstants } from '@/constants/url-constants';

export const invoicesRoutes: RouteObject = {
  path: UrlConstants.INVOICES_URL,
  children: [
    {
      index: true,
      element: <InvoicesTable />,
    },
    {
      path: ':id',
      element: <InvoicePage />,
    },
  ],
};
