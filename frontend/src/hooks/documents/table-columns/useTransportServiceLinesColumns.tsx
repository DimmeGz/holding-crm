import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { MRT_Cell, MRT_ColumnDef } from 'mantine-react-table';

import { CommonConstants } from '@/constants/common.constants';
import { useLibsStore } from '@/stores/useLibsStore';

import type { TransportServiceLine } from '@/types/documents/transports.types';

export function useTransportServiceLinesColumns(): MRT_ColumnDef<TransportServiceLine>[] {
  const { t } = useTranslation(['tables']);
  const { getServiceName } = useLibsStore(s => ({
    getServiceName: s.getServiceName,
  }));

  return useMemo(
    () => [
      {
        header: t('tables:columns.name'),
        id: 'serviceName',
        accessorFn: (row: TransportServiceLine): string =>
          getServiceName(row.serviceId),
        size: 240,
        Cell: ({ cell }: { cell: MRT_Cell<TransportServiceLine> }) =>
          cell.getValue<string>() || CommonConstants.EMPTY_STRING,
      },
      {
        header: t('tables:columns.qty'),
        id: 'qty',
        accessorKey: 'qty',
        size: 120,
        Cell: ({ cell }: { cell: MRT_Cell<TransportServiceLine> }) =>
          `${cell.getValue<number>()}`,
      },
      {
        header: t('tables:columns.price'),
        id: 'price',
        accessorKey: 'price',
        size: 140,
        Cell: ({ cell }: { cell: MRT_Cell<TransportServiceLine> }) =>
          `${cell.getValue<number>()}`,
      },
      {
        header: t('tables:columns.amount'),
        id: 'amount',
        accessorFn: (row: TransportServiceLine): number =>
          row.price * row.qty,
        size: 160,
        Cell: ({ cell }: { cell: MRT_Cell<TransportServiceLine> }) =>
          `${cell.getValue<number>()}`,
      },
    ],
    [t, getServiceName],
  );
}

