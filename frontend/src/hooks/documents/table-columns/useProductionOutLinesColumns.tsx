import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { MRT_Cell, MRT_ColumnDef } from 'mantine-react-table';

import { CommonConstants } from '@/constants/common.constants';
import { useLibsStore } from '@/stores/useLibsStore';

import type { ProductionOutLine } from '@/types/documents/productions.types';

export function useProductionOutLinesColumns(
): MRT_ColumnDef<ProductionOutLine>[] {
  const { t } = useTranslation(['tables']),
    getProductName: (id: number) => string = useLibsStore(s => s.getProductName),
    getPackageName: (id: number) => string = useLibsStore(s => s.getPackageName);

  return useMemo(
    () => [
      {
        header: t('tables:columns.product'),
        id: 'product',
        accessorFn: (row: ProductionOutLine): string =>
          row.product?.name || getProductName(row.productId),
        size: 200,
        Cell: ({ cell }: { cell: MRT_Cell<ProductionOutLine> }) =>
          cell.getValue<string>() || CommonConstants.EMPTY_STRING,
      },
      {
        header: t('tables:columns.batch'),
        id: 'batch',
        accessorFn: (row: ProductionOutLine): string =>
          row.batch?.name || String(row.batchId),
        size: 160,
      },
      {
        header: t('tables:columns.package'),
        id: 'package',
        accessorFn: (row: ProductionOutLine): string =>
          row.package?.name || getPackageName(row.packageId),
        size: 140,
      },
      {
        header: t('tables:columns.qty'),
        id: 'qty',
        accessorFn: (row: ProductionOutLine): number => row.qty,
        size: 100,
        Cell: ({ cell }: { cell: MRT_Cell<ProductionOutLine> }) =>
          `${cell.getValue<number>()}`,
      },
      {
        header: t('tables:columns.cost'),
        id: 'cost',
        accessorFn: (row: ProductionOutLine): number => row.cost,
        size: 140,
        Cell: ({ cell }: { cell: MRT_Cell<ProductionOutLine> }) =>
          `${cell.getValue<number>()}`,
      },
    ],
    [t, getPackageName, getProductName],
  );
}
