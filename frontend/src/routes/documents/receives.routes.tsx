import type { RouteObject } from 'react-router-dom';
import {
  ReceiveCreatePage,
  ReceiveEditPage,
} from '@/components/documents/receives/ReceiveFormPage';
import { ReceivePage } from '@/components/documents/receives/ReceivePage';
import { ReceivesTable } from '@/components/documents/receives/ReceivesTable';
import { UrlConstants } from '@/constants/url-constants';

export const receivesRoutes: RouteObject = {
  path: UrlConstants.RECEIVES_URL,
  children: [
    {
      index: true,
      element: <ReceivesTable />,
    },
    {
      path: 'new',
      element: <ReceiveCreatePage />,
    },
    {
      path: ':id/edit',
      element: <ReceiveEditPage />,
    },
    {
      path: ':id',
      element: <ReceivePage />,
    },
  ],
};
