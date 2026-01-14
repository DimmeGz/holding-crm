import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { MRT_Cell, MRT_ColumnDef } from 'mantine-react-table';
import type { OrderLine } from '@/types/documents/orders.types';

export function useOrderLinesColumns(
  currency: string,
): MRT_ColumnDef<OrderLine>[] {
  const { t } = useTranslation(['tables']);

  return useMemo(
    () => [
      {
        header: t('tables:columns.productMan'),
        accessorFn: (row: OrderLine) => row.productMan.name,
        id: 'productMan',
      },
      {
        header: t('tables:columns.productBuy'),
        accessorFn: (row: OrderLine) => row.productBuy.name,
        id: 'productBuy',
      },
      {
        header: t('tables:columns.batchRename'),
        accessorKey: 'batchRename',
        id: 'batchRename',
      },
      {
        header: t('tables:columns.package'),
        accessorFn: (row: OrderLine) => row.package.name,
        id: 'package',
      },
      {
        header: t('tables:columns.qty'),
        accessorKey: 'qty',
        id: 'qty',
        Cell: ({ cell }: { cell: MRT_Cell<OrderLine> }) =>
          `${cell.getValue<number>()} ${t('tables:columns.kg')}`,
      },
      {
        header: t('tables:columns.price'),
        accessorKey: 'price',
        id: 'price',
        Cell: ({ cell }: { cell: MRT_Cell<OrderLine> }) =>
          `${cell.getValue<number>()} ${currency}`,
      },
      {
        header: t('tables:columns.amount'),
        accessorFn: (row: OrderLine) => row.price * row.qty,
        id: 'amount',
        Cell: ({ cell }: { cell: MRT_Cell<OrderLine> }) =>
          `${cell.getValue<number>()} ${currency}`,
      },
    ],
    [t, currency],
  );
}
