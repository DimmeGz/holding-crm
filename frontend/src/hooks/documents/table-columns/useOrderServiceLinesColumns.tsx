import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { MRT_ColumnDef, MRT_Cell } from 'mantine-react-table';
import { CommonConstants } from '@/constants/common.constants';
import { useLibsStore } from '@/stores/useLibsStore';
import type { OrderServiceLine } from '@/types/documents/orders.types';

export function useOrderServiceLinesColumns(
  currency: string,
): MRT_ColumnDef<OrderServiceLine>[] {
  const { t } = useTranslation(['tables']);
  const getServiceName = useLibsStore(s => s.getServiceName);

  return useMemo(
    () => [
      {
        header: t('tables:columns.name'),
        id: 'serviceName',
        accessorFn: (row: OrderServiceLine): string =>
          getServiceName(row.serviceId),
        size: 200,
        Cell: ({ cell }: { cell: MRT_Cell<OrderServiceLine> }) =>
          cell.getValue<string>() || CommonConstants.EMPTY_STRING,
      },
      {
        header: t('tables:columns.qty'),
        id: 'qty',
        accessorKey: 'qty',
        size: 100,
      },
      {
        header: t('tables:columns.price'),
        id: 'price',
        accessorKey: 'price',
        size: 120,
        Cell: ({ cell }: { cell: MRT_Cell<OrderServiceLine> }) =>
          `${cell.getValue<number>()} ${currency}`,
      },
      {
        header: t('tables:columns.amount'),
        id: 'amount',
        accessorFn: (row: OrderServiceLine): number => row.price * row.qty,
        size: 140,
        Cell: ({ cell }: { cell: MRT_Cell<OrderServiceLine> }) =>
          `${cell.getValue<number>()} ${currency}`,
      },
    ],
    [currency, getServiceName, t],
  );
}
