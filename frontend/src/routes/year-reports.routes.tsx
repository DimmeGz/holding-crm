import type { RouteObject } from 'react-router-dom';
import { YearReportPage } from '@/components/reports/YearReportPage';
import { UrlConstants } from '@/constants/url-constants';

export const yearReportsRoutes: RouteObject = {
  path: UrlConstants.YEAR_REPORT_URL,
  children: [
    {
      path: ':companyId',
      element: <YearReportPage />,
    },
  ],
};
