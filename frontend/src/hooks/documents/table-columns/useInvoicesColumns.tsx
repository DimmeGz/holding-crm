import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from '@mantine/core';
import type { MRT_ColumnDef, MRT_Row } from 'mantine-react-table';
import { UrlConstants } from '@/constants/url-constants';
import { useTableColumns } from '@/hooks/documents/table-columns/useTableColumns';
import type { UseTableColumns } from '@/types/documents/common-documents.types';
import type { GetInvoicesDto } from '@/types/documents/invoices.types';

export function useInvoicesColumns(): MRT_ColumnDef<GetInvoicesDto>[] {
  const { t } = useTranslation(['tables', 'documents']),
    commonColumns: UseTableColumns = useTableColumns();

  return useMemo(
    () => [
      {
        header: '№',
        id: 'invoiceNumber',
        Cell: ({ row }: { row: MRT_Row<GetInvoicesDto> }) => (
          <Text
            component='a'
            href={`${UrlConstants.INVOICES_URL}/${row.original.id}`}
            td='underline'
            style={{ cursor: 'pointer' }}
          >
            {row.original.invoiceNumber}
          </Text>
        ),
      },
      commonColumns.date<GetInvoicesDto>(),
      commonColumns.seller<GetInvoicesDto>(),
      commonColumns.buyer<GetInvoicesDto>(),
      commonColumns.recipient<GetInvoicesDto>(),
      {
        header: t('tables:columns.status'),
        accessorFn: (row: GetInvoicesDto): string =>
          row.status
            ? t('documents:documents.payed')
            : t('documents:documents.invoiced'),
        id: 'status',
      },
      commonColumns.amount<GetInvoicesDto>(),
      {
        header: t('documents:documents.byInvoice'),
        id: 'invoiceParent',
        Cell: ({ row }: { row: MRT_Row<GetInvoicesDto> }) =>
          row.original.parent && (
            <Text
              component='a'
              href={`${UrlConstants.INVOICES_URL}/${row.original.parent.id}`}
              td='underline'
              style={{ cursor: 'pointer' }}
            >
              {row.original.parent.invoiceNumber}
            </Text>
          ),
      },
    ],
    [commonColumns, t],
  );
}
