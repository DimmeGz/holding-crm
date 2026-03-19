import type { RouteObject } from 'react-router-dom';
import { ProductionsTable } from '@/components/documents/productions/ProductionsTable';
import { ProductionPage } from '@/components/documents/productions/ProductionPage';
import { UrlConstants } from '@/constants/url-constants';

export const productionsRoutes: RouteObject = {
  path: UrlConstants.PRODUCTION_URL,
  children: [
    {
      index: true,
      element: <ProductionsTable />,
    },
    {
      path: ':id',
      element: <ProductionPage />,
    },
  ],
};
