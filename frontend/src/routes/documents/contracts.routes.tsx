import type { RouteObject } from 'react-router-dom';
import { ContractsTable } from '@/components/documents/contracts/ContractsTable';
import { UrlConstants } from '@/constants/url-constants';

export const contractsRoutes: RouteObject = {
  path: UrlConstants.CONTRACTS_URL,
  children: [
    {
      index: true,
      element: <ContractsTable />,
    },
    // {
    //   path: ':id',
    //   element: <ContractsPage />,
    // },
  ],
};
