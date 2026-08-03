import type { RouteObject } from 'react-router-dom';
import { MonthReportPage } from '@/components/reports/MonthReportPage';
import { UrlConstants } from '@/constants/url-constants';

export const reportsRoutes: RouteObject = {
  path: UrlConstants.MONTH_REPORT_URL,
  children: [
    {
      path: ':companyId',
      element: <MonthReportPage />,
    },
  ],
};
