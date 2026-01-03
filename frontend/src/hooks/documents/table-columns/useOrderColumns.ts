import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { MRT_ColumnDef } from 'mantine-react-table';
import { useTableColumns } from '@/hooks/documents/table-columns/useTableColumns';
import type { UseTableColumns } from '@/types/common.types';
import type { GetOrdersDto } from '@/types/documents/orders.types';

export function useOrdersColumns(): MRT_ColumnDef<GetOrdersDto>[] {
  const { t } = useTranslation(['tables']);
  const commonColumns: UseTableColumns = useTableColumns();

  return useMemo(
    () => [
      {
        header: t('tables:columns.orderNumber'),
        accessorFn: (row: GetOrdersDto) => row.orderNumber,
        id: 'orderNumber',
      },
      commonColumns.seller<GetOrdersDto>(),
      commonColumns.buyer<GetOrdersDto>(),
      commonColumns.recipient<GetOrdersDto>(),
      commonColumns.date<GetOrdersDto>(),
      commonColumns.confirmDate<GetOrdersDto>(),
      commonColumns.amount<GetOrdersDto>(),
      commonColumns.byContract<GetOrdersDto>(),
      commonColumns.status<GetOrdersDto>(),
      {
        header: t('tables:columns.goods'),
        accessorFn: (row: GetOrdersDto) => row.orderProducts.join(', '),
        id: 'orderProducts',
      },
    ],
    [t, commonColumns],
  );
}
