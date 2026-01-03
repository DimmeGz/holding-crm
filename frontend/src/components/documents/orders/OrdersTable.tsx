import type { ReactNode } from 'react';
import { type MRT_ColumnDef, type MRT_TableOptions } from 'mantine-react-table';
import { HoldingTable } from '@/components/shared/HoldingTable';
import { Spinner } from '@/components/shared/Spinner';
import { useOrdersColumns } from '@/hooks/documents/table-columns/useOrderColumns';
import { useUsers } from '@/hooks/documents/useOrders';
import type { GetOrdersDto } from '@/types/documents/orders.types';

export function OrdersTable(): ReactNode {
  const { data, loading, error } = useUsers();
  const columns: MRT_ColumnDef<GetOrdersDto>[] = useOrdersColumns();

  const tableConfig: MRT_TableOptions<GetOrdersDto> = {
    data,
    columns,
  };

  return (
    <>
      {loading && <Spinner />}

      {!loading && error && <h3>Помилка завантаження даних: {error}</h3>}

      {!loading && !error && <HoldingTable tableOptions={tableConfig} />}
    </>
  );
}
