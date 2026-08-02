import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from '@mantine/core';
import type { MRT_ColumnDef, MRT_TableOptions } from 'mantine-react-table';
import { HoldingTable } from '@/components/shared/HoldingTable';
import { Spinner } from '@/components/shared/Spinner';
import { UrlConstants } from '@/constants/url-constants';
import { useShipmentsColumns } from '@/hooks/documents/table-columns/useShipmentsColumns';
import { useShipments } from '@/hooks/documents/useShipments';
import type { GetShipmentsDto } from '@/types/documents/shipments.types';

export function ShipmentsTable(): ReactNode {
  const { t } = useTranslation(['common', 'tables']);
  const { data, loading, error } = useShipments();
  const columns: MRT_ColumnDef<GetShipmentsDto>[] = useShipmentsColumns();
  const tableConfig: MRT_TableOptions<GetShipmentsDto> = {
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
          title={t('common:nav.shipments')}
          toolBarControls={
            <Button component={Link} to={`${UrlConstants.SHIPMENTS_URL}/new`}>
              {t('common:actions.create')}
            </Button>
          }
        />
      )}
    </>
  );
}
