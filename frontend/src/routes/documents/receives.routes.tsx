import type { RouteObject } from 'react-router-dom';
import { ReceivesTable } from '@/components/documents/receives/ReceivesTable';
import { ReceivePage } from '@/components/documents/receives/ReceivePage';
import { UrlConstants } from '@/constants/url-constants';

export const receivesRoutes: RouteObject = {
  path: UrlConstants.RECEIVES_URL,
  children: [
    {
      index: true,
      element: <ReceivesTable />,
    },
    {
      path: ':id',
      element: <ReceivePage />,
    },
  ],
};
