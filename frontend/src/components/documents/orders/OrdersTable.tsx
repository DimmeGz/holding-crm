import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { type MRT_ColumnDef, type MRT_TableOptions } from 'mantine-react-table';
import { HoldingTable } from '@/components/shared/HoldingTable';
import { Spinner } from '@/components/shared/Spinner';
import { useOrdersColumns } from '@/hooks/documents/table-columns/useOrderColumns';
import { useOrders } from '@/hooks/documents/useOrders';
import type { GetOrdersDto } from '@/types/documents/orders.types';

export function OrdersTable(): ReactNode {
  const { data, loading, error } = useOrders();
  const columns: MRT_ColumnDef<GetOrdersDto>[] = useOrdersColumns();

  const { t } = useTranslation(['common']);
  const tableConfig: MRT_TableOptions<GetOrdersDto> = {
    data: data ?? [],
    columns,
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
