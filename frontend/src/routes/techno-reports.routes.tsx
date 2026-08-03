import type { RouteObject } from 'react-router-dom';
import { TechnoReportPage } from '@/components/reports/TechnoReportPage';
import { UrlConstants } from '@/constants/url-constants';

export const technoReportsRoutes: RouteObject = {
  path: UrlConstants.TECHNO_REPORT_URL,
  element: <TechnoReportPage />,
};
