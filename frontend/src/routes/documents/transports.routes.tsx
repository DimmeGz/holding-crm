import type { RouteObject } from 'react-router-dom';

import { TransportsTable } from '@/components/documents/transports/TransportsTable';
import { TransportPage } from '@/components/documents/transports/TransportPage';
import { UrlConstants } from '@/constants/url-constants';

export const transportsRoutes: RouteObject = {
  path: UrlConstants.TRANSPORT_URL,
  children: [
    {
      index: true,
      element: <TransportsTable />,
    },
    {
      path: ':id',
      element: <TransportPage />,
    },
  ],
};

