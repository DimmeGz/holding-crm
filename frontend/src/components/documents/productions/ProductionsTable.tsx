import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import type { MRT_ColumnDef, MRT_TableOptions } from 'mantine-react-table';
import { HoldingTable } from '@/components/shared/HoldingTable';
import { Spinner } from '@/components/shared/Spinner';
import { useProductionsColumns } from '@/hooks/documents/table-columns/useProductionsColumns';
import { useProductions } from '@/hooks/documents/useProductions';
import type { GetProductionsDto } from '@/types/documents/productions.types';

export function ProductionsTable(): ReactNode {
  const { t } = useTranslation(['common', 'tables']),
    { data, loading, error } = useProductions(),
    columns: MRT_ColumnDef<GetProductionsDto>[] = useProductionsColumns(),
    tableConfig: MRT_TableOptions<GetProductionsDto> = {
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
          title={t('common:nav.production')}
        />
      )}
    </>
  );
}
