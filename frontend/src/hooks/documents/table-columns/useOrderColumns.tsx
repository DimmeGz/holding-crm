import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from '@mantine/core';
import type { MRT_ColumnDef, MRT_Row } from 'mantine-react-table';
import { UrlConstants } from '@/constants/url-constants';
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
        accessorKey: 'orderNumber', // ← тут просто ключ для даних
        id: 'orderNumber',
        Cell: ({ row }: { row: MRT_Row<GetOrdersDto> }) => (
          <Text
            component='a'
            href={`${UrlConstants.ORDERS_URL}/${row.original.id}`}
            onClick={(event: React.MouseEvent<HTMLAnchorElement>) =>
              event.preventDefault()
            }
            td='underline'
            style={{ cursor: 'pointer' }}
          >
            {row.original.orderNumber}
          </Text>
        ),
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
