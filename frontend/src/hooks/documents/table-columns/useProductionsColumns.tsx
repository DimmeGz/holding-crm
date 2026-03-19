import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { MRT_ColumnDef, MRT_Row } from 'mantine-react-table';
import { Text } from '@mantine/core';
import { CommonConstants } from '@/constants/common.constants';
import { UrlConstants } from '@/constants/url-constants';
import { useTableColumns } from '@/hooks/documents/table-columns/useTableColumns';
import type { UseTableColumns } from '@/types/documents/common-documents.types';
import type { GetProductionsDto } from '@/types/documents/productions.types';

export function useProductionsColumns(): MRT_ColumnDef<GetProductionsDto>[] {
  const { t } = useTranslation(['tables', 'documents']),
    commonColumns: UseTableColumns = useTableColumns();

  return useMemo(
    () => [
      {
        header: CommonConstants.NUMBER,
        id: 'id',
        size: 100,
        Cell: ({ row }: { row: MRT_Row<GetProductionsDto> }) => (
          <Text
            component='a'
            href={`${UrlConstants.PRODUCTION_URL}/${row.original.id}`}
            td='underline'
            style={{ cursor: 'pointer' }}
          >
            {row.original.id}
          </Text>
        ),
      },
      {
        header: t('documents:documents.company'),
        id: 'company',
        accessorFn: (row: GetProductionsDto): string =>
          row.company?.name || CommonConstants.EMPTY_STRING,
      },
      {
        header: t('documents:documents.warehouse'),
        id: 'warehouse',
        accessorFn: (row: GetProductionsDto): string =>
          row.warehouse?.name || CommonConstants.EMPTY_STRING,
      },
      commonColumns.date<GetProductionsDto>(),
      commonColumns.status<GetProductionsDto>(),
    ],
    [commonColumns, t],
  );
}
