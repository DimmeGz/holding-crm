import type { RouteObject } from 'react-router-dom';
import { ProductionReportPage } from '@/components/reports/ProductionReportPage';
import { UrlConstants } from '@/constants/url-constants';

export const productionReportsRoutes: RouteObject = {
  path: UrlConstants.PRODUCTION_REPORT_URL,
  children: [
    {
      path: ':companyId',
      element: <ProductionReportPage />,
    },
  ],
};
