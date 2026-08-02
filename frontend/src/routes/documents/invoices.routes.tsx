import type { RouteObject } from 'react-router-dom';
import {
  InvoiceCreatePage,
  InvoiceEditPage,
} from '@/components/documents/invoices/InvoiceFormPage';
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
      path: 'new',
      element: <InvoiceCreatePage />,
    },
    {
      path: ':id/edit',
      element: <InvoiceEditPage />,
    },
    {
      path: ':id',
      element: <InvoicePage />,
    },
  ],
};
