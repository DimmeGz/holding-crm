import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Title } from '@mantine/core';
import {
  MantineReactTable,
  type MRT_Localization,
  type MRT_RowData,
  type MRT_TableInstance,
  type MRT_TableOptions,
  useMantineReactTable,
} from 'mantine-react-table';
import { MRT_Localization_EN } from 'mantine-react-table/locales/en/index.cjs';
import { MRT_Localization_UK } from 'mantine-react-table/locales/uk/index.cjs';

export function HoldingTable<TData extends MRT_RowData>({
  tableOptions,
  title,
}: {
  tableOptions: MRT_TableOptions<TData>;
  title?: string;
}): ReactNode {
  const { i18n } = useTranslation();
  const localization: MRT_Localization =
    i18n.language === 'uk' ? MRT_Localization_UK : MRT_Localization_EN;

  const table: MRT_TableInstance<TData> = useMantineReactTable({
    localization,
    mantinePaginationProps: {
      rowsPerPageOptions: ['50', '100', '200', '500'],
    },
    mantineTableProps: {
      striped: true,
    },
    renderTopToolbarCustomActions: () => (
      <Title order={3} ml='xs' mt='xs'>
        {title}
      </Title>
    ),
    initialState: { pagination: { pageSize: 50, pageIndex: 1 } },
    ...tableOptions,
  });

  return <MantineReactTable table={table} />;
}
