import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { MRT_ColumnDef, MRT_Cell } from 'mantine-react-table';
import type { InvoiceServiceLine } from '@/types/documents/invoices.types';
import { CommonConstants } from '@/constants/common.constants';
import { useLibsStore } from '@/stores/useLibsStore';

export function useInvoiceServiceLinesColumns(
  currency: string,
): MRT_ColumnDef<InvoiceServiceLine>[] {
  const { t } = useTranslation(['tables']),
    getServiceName: (id: number) => string = useLibsStore(
      s => s.getServiceName,
    );

  return useMemo(
    () => [
      {
        header: t('tables:columns.name'),
        id: 'serviceName',
        accessorFn: (row: InvoiceServiceLine): string =>
          getServiceName(row.serviceId),
        size: 200,
        Cell: ({ cell }: { cell: MRT_Cell<InvoiceServiceLine> }) =>
          cell.getValue<string>() || CommonConstants.EMPTY_STRING,
      },
      {
        header: t('tables:columns.qty'),
        id: 'qty',
        accessorKey: 'qty',
        size: 100,
        Cell: ({ cell }: { cell: MRT_Cell<InvoiceServiceLine> }) =>
          `${cell.getValue<number>()}`,
      },
      {
        header: t('tables:columns.price'),
        id: 'price',
        accessorKey: 'price',
        size: 120,
        Cell: ({ cell }: { cell: MRT_Cell<InvoiceServiceLine> }) =>
          `${cell.getValue<number>()} ${currency}`,
      },
      {
        header: t('tables:columns.amount'),
        id: 'amount',
        accessorFn: (row: InvoiceServiceLine): number => row.price * row.qty,
        size: 140,
        Cell: ({ cell }: { cell: MRT_Cell<InvoiceServiceLine> }) =>
          `${cell.getValue<number>()} ${currency}`,
      },
    ],
    [currency, t],
  );
}
