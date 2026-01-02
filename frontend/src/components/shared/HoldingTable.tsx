import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_RowData,
  type MRT_TableInstance,
  type MRT_TableOptions,
} from 'mantine-react-table';
import type { ReactNode } from 'react';

export function HoldingTable<TData extends MRT_RowData>({
  tableOptions,
}: {
  tableOptions: MRT_TableOptions<TData>;
}): ReactNode {
  const table: MRT_TableInstance<TData> = useMantineReactTable(tableOptions);

  return <MantineReactTable table={table} />;
}
