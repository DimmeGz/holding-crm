import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { MRT_Cell, MRT_ColumnDef } from 'mantine-react-table';

import { CommonConstants } from '@/constants/common.constants';
import { useLibsStore } from '@/stores/useLibsStore';

import type { ProductionInLine } from '@/types/documents/productions.types';

export function useProductionInLinesColumns(
): MRT_ColumnDef<ProductionInLine>[] {
  const { t } = useTranslation(['tables']),
    getProductName: (id: number) => string = useLibsStore(s => s.getProductName),
    getPackageName: (id: number) => string = useLibsStore(s => s.getPackageName);

  return useMemo(
    () => [
      {
        header: t('tables:columns.product'),
        id: 'product',
        accessorFn: (row: ProductionInLine): string =>
          row.product?.name || getProductName(row.productId),
        size: 200,
        Cell: ({ cell }: { cell: MRT_Cell<ProductionInLine> }) =>
          cell.getValue<string>() || CommonConstants.EMPTY_STRING,
      },
      {
        header: t('tables:columns.batch'),
        id: 'batch',
        accessorFn: (row: ProductionInLine): string =>
          row.batch?.name || String(row.batchId),
        size: 160,
      },
      {
        header: t('tables:columns.package'),
        id: 'package',
        accessorFn: (row: ProductionInLine): string =>
          row.package?.name || getPackageName(row.packageId),
        size: 140,
      },
      {
        header: t('tables:columns.qty'),
        id: 'qty',
        accessorFn: (row: ProductionInLine): number => row.qty,
        size: 100,
        Cell: ({ cell }: { cell: MRT_Cell<ProductionInLine> }) =>
          `${cell.getValue<number>()}`,
      },
    ],
    [t, getPackageName, getProductName],
  );
}

