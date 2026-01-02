import type { ReactNode } from 'react';
import {
  MantineReactTable,
  type MRT_RowData,
  type MRT_TableInstance,
  type MRT_TableOptions,
  useMantineReactTable,
} from 'mantine-react-table';
import { MRT_Localization_UK } from 'mantine-react-table/locales/uk/index.cjs';

export function HoldingTable<TData extends MRT_RowData>({
  tableOptions,
}: {
  tableOptions: MRT_TableOptions<TData>;
}): ReactNode {
  const table: MRT_TableInstance<TData> = useMantineReactTable({
    localization: MRT_Localization_UK,
    mantinePaginationProps: {
      rowsPerPageOptions: ['50', '100', '200', '500'],
    },
    initialState: { pagination: { pageSize: 50, pageIndex: 1 } },
    ...tableOptions,
  });

  return <MantineReactTable table={table} />;
}
