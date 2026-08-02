import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from '@mantine/core';
import type { MRT_ColumnDef, MRT_TableOptions } from 'mantine-react-table';
import { HoldingTable } from '@/components/shared/HoldingTable';
import { Spinner } from '@/components/shared/Spinner';
import { UrlConstants } from '@/constants/url-constants';
import { useReceivesColumns } from '@/hooks/documents/table-columns/useReceivesColumns';
import { useReceives } from '@/hooks/documents/useReceives';
import type { GetReceivesDto } from '@/types/documents/receives.types';

export function ReceivesTable(): ReactNode {
  const { t } = useTranslation(['common', 'tables']);
  const { data, loading, error } = useReceives();
  const columns: MRT_ColumnDef<GetReceivesDto>[] = useReceivesColumns();
  const tableConfig: MRT_TableOptions<GetReceivesDto> = {
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
          title={t('common:nav.receives')}
          toolBarControls={
            <Button component={Link} to={`${UrlConstants.RECEIVES_URL}/new`}>
              {t('common:actions.create')}
            </Button>
          }
        />
      )}
    </>
  );
}
