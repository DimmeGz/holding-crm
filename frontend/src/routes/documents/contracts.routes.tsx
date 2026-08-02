import type { RouteObject } from 'react-router-dom';
import { ContractCreatePage, ContractEditPage } from '@/components/documents/contracts/ContractFormPage';
import { ContractPage } from '@/components/documents/contracts/ContractPage';
import { ContractsTable } from '@/components/documents/contracts/ContractsTable';
import { UrlConstants } from '@/constants/url-constants';

export const contractsRoutes: RouteObject = {
  path: UrlConstants.CONTRACTS_URL,
  children: [
    {
      index: true,
      element: <ContractsTable />,
    },
    {
      path: 'new',
      element: <ContractCreatePage />,
    },
    {
      path: ':id/edit',
      element: <ContractEditPage />,
    },
    {
      path: ':id',
      element: <ContractPage />,
    },
  ],
};
