import type { RouteObject } from 'react-router-dom';
import {
  TransportCreatePage,
  TransportEditPage,
} from '@/components/documents/transports/TransportFormPage';
import { TransportPage } from '@/components/documents/transports/TransportPage';
import { TransportsTable } from '@/components/documents/transports/TransportsTable';
import { UrlConstants } from '@/constants/url-constants';

export const transportsRoutes: RouteObject = {
  path: UrlConstants.TRANSPORT_URL,
  children: [
    {
      index: true,
      element: <TransportsTable />,
    },
    {
      path: 'new',
      element: <TransportCreatePage />,
    },
    {
      path: ':id/edit',
      element: <TransportEditPage />,
    },
    {
      path: ':id',
      element: <TransportPage />,
    },
  ],
};
