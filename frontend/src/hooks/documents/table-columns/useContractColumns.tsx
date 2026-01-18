import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from '@mantine/core';
import type { MRT_ColumnDef, MRT_Row } from 'mantine-react-table';
import { CommonConstants } from '@/constants/common.constants';
import { UrlConstants } from '@/constants/url-constants';
import { useTableColumns } from '@/hooks/documents/table-columns/useTableColumns';
import type { UseTableColumns } from '@/types/documents/common-documents.types';
import type { GetContractsDto } from '@/types/documents/contracts.types';

export function useContractColumns(): MRT_ColumnDef<GetContractsDto>[] {
  const { t } = useTranslation(['tables', 'documents']),
    commonColumns: UseTableColumns = useTableColumns();

  return useMemo(
    () => [
      {
        header: t('tables:columns.name'),
        accessorKey: 'contractName',
        id: 'contractName',
        Cell: ({ row }: { row: MRT_Row<GetContractsDto> }) => (
          <Text
            component='a'
            href={`${UrlConstants.CONTRACTS_URL}/${row.original.id}`}
            td='underline'
            style={{ cursor: 'pointer' }}
            ml={`${row.original.parentId ? 'lg' : undefined}`}
          >
            {`${row.original.parentId ? CommonConstants.HYPHEN : CommonConstants.EMPTY_STRING} ${row.original.name}`
              }
          </Text>
        ),
      },
      commonColumns.seller<GetContractsDto>(),
      commonColumns.buyer<GetContractsDto>(),
      {
        header: t('tables:columns.signatureDate'),
        accessorFn: (row: GetContractsDto): string =>
          new Date(row.signatureDate).toLocaleDateString('uk-UA'),
        id: 'signatureDate',
      },
      {
        header: t('tables:columns.expirationDate'),
        accessorFn: (row: GetContractsDto): string =>
          row.term
            ? new Date(row.term).toLocaleDateString('uk-UA')
            : t('documents:documents:perpetual'),
        id: 'expirationDate',
      },
      {
        header: t('tables:columns.status'),
        accessorFn: (row: GetContractsDto): string =>
          row.status
            ? t('documents:documents:closed')
            : t('documents:documents:valid'),
        id: 'status',
      },
    ],
    [t, commonColumns],
  );
}
