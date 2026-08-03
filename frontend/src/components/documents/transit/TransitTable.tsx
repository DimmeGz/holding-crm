import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import type { MRT_ColumnDef, MRT_TableOptions } from 'mantine-react-table';
import { HoldingTable } from '@/components/shared/HoldingTable';
import { Spinner } from '@/components/shared/Spinner';
import { useTransitColumns } from '@/hooks/documents/table-columns/useTransitColumns';
import { useTransit } from '@/hooks/documents/useTransit';
import type { GetTransitLineDto } from '@/types/documents/transit.types';

export function TransitTable(): ReactNode {
  const { t } = useTranslation(['common']);
  const { data, loading, error } = useTransit();
  const columns: MRT_ColumnDef<GetTransitLineDto>[] = useTransitColumns();
  const tableConfig: MRT_TableOptions<GetTransitLineDto> = {
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
          title={t('common:nav.transit')}
        />
      )}
    </>
  );
}
