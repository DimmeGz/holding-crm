import type { RouteObject } from 'react-router-dom';
import { TransitTable } from '@/components/documents/transit/TransitTable';
import { UrlConstants } from '@/constants/url-constants';

export const transitRoutes: RouteObject = {
  path: UrlConstants.TRANSIT_URL,
  children: [
    {
      index: true,
      element: <TransitTable />,
    },
  ],
};
