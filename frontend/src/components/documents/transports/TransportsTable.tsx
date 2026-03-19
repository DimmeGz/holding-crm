import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import type { MRT_ColumnDef, MRT_TableOptions } from 'mantine-react-table';
import { HoldingTable } from '@/components/shared/HoldingTable';
import { Spinner } from '@/components/shared/Spinner';
import { useTransportsColumns } from '@/hooks/documents/table-columns/useTransportsColumns';
import { useTransports } from '@/hooks/documents/useTransports';
import type { GetTransportsDto } from '@/types/documents/transports.types';

export function TransportsTable(): ReactNode {
  const { t } = useTranslation(['common', 'tables', 'documents']),
    { data, loading, error } = useTransports(),
    columns: MRT_ColumnDef<GetTransportsDto>[] = useTransportsColumns(),
    tableConfig: MRT_TableOptions<GetTransportsDto> = {
      data: data ?? [],
      columns,
      mantineTableContainerProps: {
        style: {
          height: '87vh',
        },
      },
    };

  return (
    <>
      {loading && <Spinner />}

      {!loading && error && (
        <h3>
          {t('common:messages.error')} {error}
        </h3>
      )}

      {!loading && !error && (
        <HoldingTable
          tableOptions={tableConfig}
          title={t('common:nav.transportations')}
        />
      )}
    </>
  );
}

