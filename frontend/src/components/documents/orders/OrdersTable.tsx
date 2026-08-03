import { type ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router-dom';
import { Button, Group } from '@mantine/core';
import { type MRT_ColumnDef, type MRT_TableOptions } from 'mantine-react-table';
import {
  OrderStatusFilters,
  ProcessFilters,
  TypeFilters,
} from '@/components/documents/common/DocumentListFilters';
import { HoldingTable } from '@/components/shared/HoldingTable';
import { Spinner } from '@/components/shared/Spinner';
import { UrlConstants } from '@/constants/url-constants';
import {
  parseOrderListQuery,
  toOrdersApiQuery,
  type DocumentTypeParam,
  type OrderStatusUrl,
} from '@/helpers/documents-query.helpers';
import { useOrdersColumns } from '@/hooks/documents/table-columns/useOrderColumns';
import { useOrders } from '@/hooks/documents/useOrders';
import { useLibsStore } from '@/stores/useLibsStore';
import type { GetOrdersDto } from '@/types/documents/orders.types';

export function OrdersTable(): ReactNode {
  const { t } = useTranslation(['common', 'documents']);
  const [searchParams, setSearchParams] = useSearchParams();
  const technicalProcesses = useLibsStore((s) => s.technicalProcesses);

  const parsed = useMemo(
    () => parseOrderListQuery(searchParams),
    [searchParams],
  );
  const apiQuery = useMemo(() => toOrdersApiQuery(parsed), [parsed]);

  const { data, loading, error } = useOrders(apiQuery);
  const columns: MRT_ColumnDef<GetOrdersDto>[] = useOrdersColumns();

  const title = useMemo(() => {
    const parts = [t('common:nav.orders')];

    if (parsed.statusUrl === 'open') {
      parts.push(t('common:filters.open'));
    } else if (parsed.statusUrl === 'closed') {
      parts.push(`${t('common:filters.closed')} ${parsed.year ?? ''}`.trim());
    } else {
      parts.push(`${t('common:filters.all')} ${parsed.year ?? ''}`.trim());
    }

    if (parsed.process && technicalProcesses[parsed.process]) {
      parts.push(technicalProcesses[parsed.process]);
    }

    return parts.join(' || ');
  }, [parsed.process, parsed.statusUrl, parsed.year, t, technicalProcesses]);

  const updateParams = (mutate: (next: URLSearchParams) => void): void => {
    const next = new URLSearchParams(searchParams);
    mutate(next);
    setSearchParams(next);
  };

  const handleStatusChange = (statusUrl: OrderStatusUrl): void => {
    updateParams((next) => {
      const currentYear = String(new Date().getFullYear());

      if (statusUrl === 'open') {
        next.set('status', 'open');
        next.delete('year');
      } else if (statusUrl === 'closed') {
        next.set('status', 'closed');
        if (!next.get('year')) {
          next.set('year', currentYear);
        }
      } else {
        next.delete('status');
        if (!next.get('year')) {
          next.set('year', currentYear);
        }
      }
    });
  };

  const handleYearChange = (year: number): void => {
    updateParams((next) => {
      next.set('year', String(year));
      if (next.get('status') === 'open') {
        next.set('status', 'closed');
      }
    });
  };

  const handleTypeChange = (type: DocumentTypeParam | undefined): void => {
    updateParams((next) => {
      if (type) {
        next.set('type', type);
      } else {
        next.delete('type');
      }
    });
  };

  const handleProcessChange = (processId: number | undefined): void => {
    updateParams((next) => {
      if (processId === undefined) {
        next.delete('process');
      } else {
        next.set('process', String(processId));
      }
    });
  };

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
        <>
          <Group gap='xs' mb='sm' ml='xs'>
            <OrderStatusFilters
              statusUrl={parsed.statusUrl}
              year={parsed.year}
              onStatusChange={handleStatusChange}
              onYearChange={handleYearChange}
            />
            <TypeFilters
              type={parsed.type as DocumentTypeParam | undefined}
              onTypeChange={handleTypeChange}
            />
            <ProcessFilters
              processId={parsed.process}
              onProcessChange={handleProcessChange}
            />
          </Group>

          <HoldingTable
            tableOptions={tableConfig}
            title={title}
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
        </>
      )}
    </>
  );
}
