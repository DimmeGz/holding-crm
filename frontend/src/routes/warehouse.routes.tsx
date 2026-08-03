import type { RouteObject } from 'react-router-dom';
import { BatchReportPage } from '@/components/warehouse/BatchReportPage';
import { ProductReportPage } from '@/components/warehouse/ProductReportPage';
import { WarehouseTable } from '@/components/warehouse/WarehouseTable';
import { UrlConstants } from '@/constants/url-constants';

export const warehouseRoutes: RouteObject = {
  path: UrlConstants.WAREHOUSE_URL,
  children: [
    {
      index: true,
      element: <WarehouseTable />,
    },
    {
      path: 'product/:id',
      element: <ProductReportPage />,
    },
    {
      path: 'batch/:id',
      element: <BatchReportPage />,
    },
  ],
};
