import type { RouteObject } from 'react-router-dom';
import {
  ShipmentCreatePage,
  ShipmentEditPage,
} from '@/components/documents/shipments/ShipmentFormPage';
import { ShipmentPage } from '@/components/documents/shipments/ShipmentPage';
import { ShipmentsTable } from '@/components/documents/shipments/ShipmentsTable';
import { UrlConstants } from '@/constants/url-constants';

export const shipmentsRoutes: RouteObject = {
  path: UrlConstants.SHIPMENTS_URL,
  children: [
    {
      index: true,
      element: <ShipmentsTable />,
    },
    {
      path: 'new',
      element: <ShipmentCreatePage />,
    },
    {
      path: ':id/edit',
      element: <ShipmentEditPage />,
    },
    {
      path: ':id',
      element: <ShipmentPage />,
    },
  ],
};
