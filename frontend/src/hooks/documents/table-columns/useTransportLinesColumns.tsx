import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { MRT_Cell, MRT_ColumnDef } from 'mantine-react-table';
import { CommonConstants } from '@/constants/common.constants';
import { useLibsStore } from '@/stores/useLibsStore';

import type { TransportLine } from '@/types/documents/transports.types';

export function useTransportLinesColumns(): MRT_ColumnDef<TransportLine>[] {
  const { t } = useTranslation(['tables']);
  const getProductName: (id: number) => string = useLibsStore(
    s => s.getProductName,
  );
  const getPackageName: (id: number) => string = useLibsStore(
    s => s.getPackageName,
  );

  return useMemo(
    () => [
      {
        header: t('tables:columns.product'),
        id: 'product',
        accessorFn: (row: TransportLine): string =>
          row.product?.name || getProductName(row.productId),
        size: 240,
        Cell: ({ cell }: { cell: MRT_Cell<TransportLine> }) =>
          cell.getValue<string>() || CommonConstants.EMPTY_STRING,
      },
      {
        header: t('tables:columns.batch'),
        id: 'batch',
        accessorFn: (row: TransportLine): string =>
          row.batch?.name || String(row.batchId),
        size: 180,
        Cell: ({ cell }: { cell: MRT_Cell<TransportLine> }) =>
          cell.getValue<string>() || CommonConstants.EMPTY_STRING,
      },
      {
        header: t('tables:columns.package'),
        id: 'package',
        accessorFn: (row: TransportLine): string =>
          row.package?.name || getPackageName(row.packageId),
        size: 180,
        Cell: ({ cell }: { cell: MRT_Cell<TransportLine> }) =>
          cell.getValue<string>() || CommonConstants.EMPTY_STRING,
      },
      {
        header: t('tables:columns.qty'),
        id: 'qty',
        accessorFn: (row: TransportLine): number => row.qty,
        size: 110,
        Cell: ({ cell }: { cell: MRT_Cell<TransportLine> }) =>
          `${cell.getValue<number>()}`,
      },
    ],
    [t, getPackageName, getProductName],
  );
}

