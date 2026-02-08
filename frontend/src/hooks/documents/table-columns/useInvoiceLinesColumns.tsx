import { useProductTableColumns } from './useProductTableColumns';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from '@mantine/core';
import type { MRT_Cell, MRT_ColumnDef, MRT_Row } from 'mantine-react-table';
import { CommonConstants } from '@/constants/common.constants';
import { UrlConstants } from '@/constants/url-constants';
import { useLibsStore } from '@/stores/useLibsStore';
import type { UseProductTableColumns } from '@/types/documents/common-documents.types';
import type { InvoiceLine } from '@/types/documents/invoices.types';

export function useInvoiceLinesColumns(
  currency: string,
): MRT_ColumnDef<InvoiceLine>[] {
  const { t } = useTranslation(['common', 'documents', 'tables']),
    commonColumns: UseProductTableColumns = useProductTableColumns(currency),
    getCountryName: (id: number) => string = useLibsStore(
      s => s.getCountryName,
    );

  return useMemo(
    () => [
      {
        header: t('tables:columns.byOrder'),
        accessorKey: 'orderName',
        id: 'orderName',
        Cell: ({ row }: { row: MRT_Row<InvoiceLine> }) => (
          <Text
            component='a'
            href={`${UrlConstants.ORDERS_URL}/${row.original.order.id}`}
            td='underline'
            style={{ cursor: 'pointer' }}
          >
            {row.original.order.orderNumber}
          </Text>
        ),
      },
      commonColumns.product<InvoiceLine>(),
      {
        header: t('tables:columns.batch'),
        accessorFn: (row: InvoiceLine) => row.batch.name,
        id: 'batch',
        size: 100,
      },
      commonColumns.package<InvoiceLine>(),
      commonColumns.qty<InvoiceLine>(),
      commonColumns.price<InvoiceLine>(),
      {
        header: t('tables:columns.cost'),
        accessorKey: 'cost',
        id: 'cost',
        size: 100,
      },
      {
        header: t('tables:columns.palletsQty'),
        accessorKey: 'palletsQty',
        id: 'palletsQty',
        size: 100,
      },
      {
        header: t('tables:columns.countryOfOrigin'),
        accessorFn: (row: InvoiceLine) => getCountryName(row.countryOfOriginId),
        id: 'countryOfOrigin',
        size: 100,
      },
      {
        header: t('documents:documents.grossWeight'),
        accessorKey: 'grossWeight',
        id: 'grossWeight',
        size: 100,
        Cell: ({ cell }: { cell: MRT_Cell<InvoiceLine> }) =>
          cell.getValue<number>()
            ? `${cell.getValue<number>()} ${t('common:common.kg')}`
            : CommonConstants.EMPTY_STRING,
      },
      commonColumns.amount<InvoiceLine>(),
    ],
    [t, commonColumns, getCountryName],
  );
}
