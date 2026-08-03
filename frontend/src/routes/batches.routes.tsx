import type { RouteObject } from 'react-router-dom';
import { BatchesListPage } from '@/components/warehouse/BatchesListPage';
import { BatchUpdatePage } from '@/components/warehouse/BatchUpdatePage';
import { UrlConstants } from '@/constants/url-constants';

export const batchesRoutes: RouteObject = {
  path: UrlConstants.BATCHES_URL,
  children: [
    {
      index: true,
      element: <BatchesListPage />,
    },
    {
      path: ':id/edit',
      element: <BatchUpdatePage />,
    },
  ],
};
