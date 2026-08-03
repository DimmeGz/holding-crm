import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Text } from '@mantine/core';
import type { MRT_ColumnDef, MRT_Row } from 'mantine-react-table';
import { CommonConstants } from '@/constants/common.constants';
import { UrlConstants } from '@/constants/url-constants';
import type { CompanyAccountRow } from '@/types/companies/companies.types';

export function useCompaniesColumns(): MRT_ColumnDef<CompanyAccountRow>[] {
  const { t } = useTranslation(['companies']);

  return useMemo(
    () => [
      {
        header: CommonConstants.NUMBER,
        id: 'rowNumber',
        size: 60,
        Cell: ({ row }: { row: MRT_Row<CompanyAccountRow> }) => row.index + 1,
      },
      {
        header: t('companies:company'),
        accessorKey: 'companyName',
        size: 220,
        Cell: ({ row }: { row: MRT_Row<CompanyAccountRow> }) => (
          <Text
            component={Link}
            to={`${UrlConstants.COMPANIES_URL}/${row.original.companyId}`}
            td='underline'
          >
            {row.original.companyName}
          </Text>
        ),
      },
      {
        header: t('companies:currency'),
        accessorKey: 'currencyName',
        size: 100,
      },
      {
        header: t('companies:balance'),
        accessorKey: 'balance',
        size: 120,
      },
      {
        header: t('companies:wait'),
        accessorKey: 'wait',
        size: 120,
      },
      {
        header: t('companies:debtAmount'),
        accessorKey: 'debt',
        size: 120,
      },
    ],
    [t],
  );
}
