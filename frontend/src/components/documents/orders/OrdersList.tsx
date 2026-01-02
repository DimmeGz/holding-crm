import type { ReactNode } from 'react';
import { type MRT_TableOptions } from 'mantine-react-table';
import { IconCheck, IconX } from '@tabler/icons-react';
import { HoldingTable } from '@/components/shared/HoldingTable';
import { Spinner } from '@/components/shared/Spinner';
import { CommonConstants } from '@/constants/common.constants';
import { useUsers } from '@/hooks/documents/useOrders';
import type { GetOrdersDto } from '@/types/documents/orders.types';

export function OrdersList(): ReactNode {
  const { data, loading, error } = useUsers();

  const tableConfig: MRT_TableOptions<GetOrdersDto> = {
    data,
    columns: [
      {
        header: 'Продавець',
        accessorFn: (originalRow: GetOrdersDto): string => {
          return originalRow.seller.name;
        },
      },
      {
        header: 'Покупець',
        accessorFn: (originalRow: GetOrdersDto): string => {
          return originalRow.buyer.name;
        },
      },
      {
        header: 'Отримувач',
        accessorFn: (originalRow: GetOrdersDto): string => {
          return originalRow.recipient?.name;
        },
      },
      {
        header: 'Дата замовлення',
        accessorFn: (originalRow: GetOrdersDto): string => {
          return originalRow.expectedDate
            ? new Date(originalRow.expectedDate).toLocaleDateString('uk-UA')
            : CommonConstants.EMPTY_STRING;
        },
      },
      {
        header: 'Дата підтвердження',
        accessorFn: (originalRow: GetOrdersDto): string => {
          return originalRow.confirmExpectedDate
            ? new Date(originalRow.confirmExpectedDate).toLocaleDateString(
                'uk-UA',
              )
            : CommonConstants.EMPTY_STRING;
        },
      },
      {
        header: 'Сума',
        accessorFn: (originalRow: GetOrdersDto): string => {
          return `${originalRow.documentSum} ${originalRow.currency.name}`;
        },
      },
      {
        header: 'На підставі договору',
        accessorFn: (originalRow: GetOrdersDto): string => {
          return originalRow.contract.name;
        },
      },
      {
        header: 'Статус',
        accessorFn: (originalRow: GetOrdersDto): ReactNode => {
          return originalRow.status ? <IconCheck /> : <IconX />;
        },
      },
      {
        header: 'Товари',
        accessorFn: (originalRow: GetOrdersDto): string => {
          return originalRow.orderProducts.join(', ');
        },
      },
    ],
  };

  return (
    <>
      {loading && <Spinner />}

      {!loading && error && <h3>Помилка завантаження даних: {error}</h3>}

      {!loading && !error && <HoldingTable tableOptions={tableConfig} />}
    </>
  );
}
