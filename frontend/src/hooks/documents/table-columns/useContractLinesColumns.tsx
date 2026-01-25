import { useProductTableColumns } from './useProductTableColumns';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { MRT_Cell, MRT_ColumnDef } from 'mantine-react-table';
import type { UseProductTableColumns } from '@/types/documents/common-documents.types';
import type { ContractLine } from '@/types/documents/contracts.types';

export function useContractLinesColumns(
  currency: string,
): MRT_ColumnDef<ContractLine>[] {
  const { t } = useTranslation(['tables']),
    commonColumns: UseProductTableColumns = useProductTableColumns(currency);

  return useMemo(
    () => [
      commonColumns.product<ContractLine>(),
      commonColumns.package<ContractLine>(),
      commonColumns.qty<ContractLine>(),
      {
        header: t('tables:columns.shipLeft'),
        accessorKey: 'shipLeft',
        id: 'shipLeft',
        Cell: ({ cell }: { cell: MRT_Cell<ContractLine> }) =>
          `${cell.getValue<number>()} ${t('tables:columns.kg')}`,
      },
      commonColumns.price<ContractLine>(),
      {
        header: t('tables:columns.shipQty'),
        accessorKey: 'shipQty',
        id: 'shipQty',
        Cell: ({ cell }: { cell: MRT_Cell<ContractLine> }) =>
          `${cell.getValue<number>()} ${t('tables:columns.kg')}`,
      },
    ],
    [commonColumns, t],
  );
}
