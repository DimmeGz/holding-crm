import { type ChangeEvent, type ReactNode, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Switch } from '@mantine/core';
import {
  type MRT_ColumnDef,
  MRT_ExpandButton,
  type MRT_TableOptions,
} from 'mantine-react-table';
import { HoldingTable } from '@/components/shared/HoldingTable';
import { Spinner } from '@/components/shared/Spinner';
import { useContractColumns } from '@/hooks/documents/table-columns/useContractColumns';
import { useContracts } from '@/hooks/documents/useContracts';
import type { GetContractsDto } from '@/types/documents/contracts.types';

export function ContractsTable(): ReactNode {
  const { t } = useTranslation(['common', 'tables']),
    columns: MRT_ColumnDef<GetContractsDto>[] = useContractColumns(),
    { data, loading, error } = useContracts(),
    [withArchived, setWithArchived] = useState(false),
    actualContracts: GetContractsDto[] = useMemo(() => {
      if (!data) return [];

      return data
        .filter(
          contract =>
            !contract.isArchived ||
            contract.children?.some(child => !child.isArchived),
        )
        .map(contract => ({
          ...contract,
          children: contract.children?.filter(child => !child.isArchived) || [],
        }));
    }, [data]);

  const tableOptions: MRT_TableOptions<GetContractsDto> = {
    columns,
    data: withArchived ? data || [] : actualContracts,
    enableExpanding: true,
    getSubRows: row => row.children,
    initialState: {
      expanded: true,
    },
    displayColumnDefOptions: {
      'mrt-row-expand': {
        size: 32,
        minSize: 32,
        maxSize: 32,
        Cell: ({ row, table }) =>
          row.original.children && row.original.children.length > 0 ? (
            <MRT_ExpandButton row={row} table={table} />
          ) : null,
      },
    },
    mantineTableBodyRowProps: ({ row }) => ({
      style: {
        opacity: row.original.isArchived ? 0.5 : 1,
      },
    }),
  };

  return (
    <>
      {loading && <Spinner />}

      {!loading && error && <h3>Помилка завантаження даних: {error}</h3>}

      {!loading && !error && (
        <HoldingTable
          tableOptions={tableOptions}
          title={t('common:nav.contracts')}
          toolBarControls={
            <Switch
              checked={withArchived}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setWithArchived(event.currentTarget.checked)
              }
              label={t('tables:showArchived')}
            />
          }
        />
      )}
    </>
  );
}
