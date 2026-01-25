import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { type MRT_ColumnDef, type MRT_TableOptions } from 'mantine-react-table';
import { HoldingTable } from '@/components/shared/HoldingTable';
import { Spinner } from '@/components/shared/Spinner';
import { useOrdersColumns } from '@/hooks/documents/table-columns/useOrderColumns';
import { useOrders } from '@/hooks/documents/useOrders';
import type { GetOrdersDto } from '@/types/documents/orders.types';

export function OrdersTable(): ReactNode {
  const { t } = useTranslation(['common']),
    { data, loading, error } = useOrders(),
    columns: MRT_ColumnDef<GetOrdersDto>[] = useOrdersColumns(),
    tableConfig: MRT_TableOptions<GetOrdersDto> = {
      data: data ?? [],
      columns,
      mantineTableContainerProps: {
        style: {
          height: '93vh',
        },
      },
    };

  return (
    <>
      {loading && <Spinner />}

      {!loading && error && <h3>Помилка завантаження даних: {error}</h3>}

      {!loading && !error && (
        <HoldingTable
          tableOptions={tableConfig}
          title={t('common:nav.orders')}
        />
      )}
    </>
  );
}
