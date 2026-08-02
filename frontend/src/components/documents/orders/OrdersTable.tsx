import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button, Group } from '@mantine/core';
import { type MRT_ColumnDef, type MRT_TableOptions } from 'mantine-react-table';
import { HoldingTable } from '@/components/shared/HoldingTable';
import { Spinner } from '@/components/shared/Spinner';
import { UrlConstants } from '@/constants/url-constants';
import { useOrdersColumns } from '@/hooks/documents/table-columns/useOrderColumns';
import { useOrders } from '@/hooks/documents/useOrders';
import type { GetOrdersDto } from '@/types/documents/orders.types';

export function OrdersTable(): ReactNode {
  const { t } = useTranslation(['common', 'documents']);
  const { data, loading, error } = useOrders();
  const columns: MRT_ColumnDef<GetOrdersDto>[] = useOrdersColumns();
  const tableConfig: MRT_TableOptions<GetOrdersDto> = {
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
          title={t('common:nav.orders')}
          toolBarControls={
            <Group gap='xs'>
              <Button component={Link} to={`${UrlConstants.ORDERS_URL}/new`}>
                {t('common:actions.create')}
              </Button>
              <Button
                component={Link}
                to={`${UrlConstants.ORDERS_URL}/choices`}
                variant='light'
              >
                {t('documents:documents.groupInvoice')}
              </Button>
            </Group>
          }
        />
      )}
    </>
  );
}
