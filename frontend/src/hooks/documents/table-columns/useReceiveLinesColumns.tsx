import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from '@mantine/core';
import type { MRT_Cell, MRT_ColumnDef } from 'mantine-react-table';
import { CommonConstants } from '@/constants/common.constants';
import { useProductTableColumns } from '@/hooks/documents/table-columns/useProductTableColumns';
import type { UseProductTableColumns } from '@/types/documents/common-documents.types';
import type { ReceiveLine } from '@/types/documents/receives.types';

export function useReceiveLinesColumns(
  currency: string,
): MRT_ColumnDef<ReceiveLine>[] {
  const { t } = useTranslation(['tables', 'documents']),
    commonColumns: UseProductTableColumns = useProductTableColumns(currency);

  return useMemo(
    () => [
      commonColumns.product<ReceiveLine>(),
      {
        header: t('tables:columns.batch'),
        accessorFn: (row: ReceiveLine) => row.batch?.name,
        id: 'batch',
        size: 120,
        Cell: ({ cell }: { cell: MRT_Cell<ReceiveLine> }) =>
          cell.getValue<string>() ? (
            <Text>{cell.getValue<string>()}</Text>
          ) : (
            CommonConstants.EMPTY_STRING
          ),
      },
      commonColumns.package<ReceiveLine>(),
      commonColumns.qty<ReceiveLine>(),
      commonColumns.price<ReceiveLine>(),
      commonColumns.amount<ReceiveLine>(),
    ],
    [t, commonColumns],
  );
}
