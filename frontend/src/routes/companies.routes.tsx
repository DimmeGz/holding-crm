import type { RouteObject } from 'react-router-dom';
import { CompaniesTable } from '@/components/companies/CompaniesTable';
import { CompanyPage } from '@/components/companies/CompanyPage';
import { UrlConstants } from '@/constants/url-constants';

export const companiesRoutes: RouteObject = {
  path: UrlConstants.COMPANIES_URL,
  children: [
    {
      index: true,
      element: <CompaniesTable />,
    },
    {
      path: ':id',
      element: <CompanyPage />,
    },
  ],
};
