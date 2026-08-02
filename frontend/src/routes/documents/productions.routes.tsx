import type { RouteObject } from 'react-router-dom';
import {
  ProductionCreatePage,
  ProductionEditPage,
} from '@/components/documents/productions/ProductionFormPage';
import { ProductionPage } from '@/components/documents/productions/ProductionPage';
import { ProductionsTable } from '@/components/documents/productions/ProductionsTable';
import { UrlConstants } from '@/constants/url-constants';

export const productionsRoutes: RouteObject = {
  path: UrlConstants.PRODUCTION_URL,
  children: [
    {
      index: true,
      element: <ProductionsTable />,
    },
    {
      path: 'new',
      element: <ProductionCreatePage />,
    },
    {
      path: ':id/edit',
      element: <ProductionEditPage />,
    },
    {
      path: ':id',
      element: <ProductionPage />,
    },
  ],
};
