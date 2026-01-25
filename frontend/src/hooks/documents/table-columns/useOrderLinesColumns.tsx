import { useProductTableColumns } from './useProductTableColumns';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { MRT_ColumnDef } from 'mantine-react-table';
import { useLibsStore } from '@/stores/useLibsStore';
import type { UseProductTableColumns } from '@/types/documents/common-documents.types';
import type { OrderLine } from '@/types/documents/orders.types';

export function useOrderLinesColumns(
  currency: string,
): MRT_ColumnDef<OrderLine>[] {
  const { t } = useTranslation(['tables']),
    commonColumns: UseProductTableColumns = useProductTableColumns(currency),
    getProductName: (id: number) => string = useLibsStore(
      s => s.getProductName,
    );

  return useMemo(
    () => [
      {
        header: t('tables:columns.productMan'),
        accessorFn: (row: OrderLine) => getProductName(row.productManId),
        id: 'productMan',
      },
      {
        header: t('tables:columns.productBuy'),
        accessorFn: (row: OrderLine) => getProductName(row.productBuyId),
        id: 'productBuy',
      },
      {
        header: t('tables:columns.batchRename'),
        accessorKey: 'batchRename',
        id: 'batchRename',
      },
      commonColumns.package<OrderLine>(),
      commonColumns.qty<OrderLine>(),
      commonColumns.price<OrderLine>(),
      commonColumns.amount<OrderLine>(),
    ],
    [t, commonColumns, getProductName],
  );
}
