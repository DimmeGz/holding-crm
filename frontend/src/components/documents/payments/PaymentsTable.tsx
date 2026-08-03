import { type ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router-dom';
import { Button, Group } from '@mantine/core';
import type { MRT_ColumnDef, MRT_TableOptions } from 'mantine-react-table';
import { TypeFilters } from '@/components/documents/common/DocumentListFilters';
import { HoldingTable } from '@/components/shared/HoldingTable';
import { Spinner } from '@/components/shared/Spinner';
import { UrlConstants } from '@/constants/url-constants';
import {
  parseDocumentType,
  parsePositiveInt,
  type DocumentTypeParam,
} from '@/helpers/documents-query.helpers';
import { usePaymentsColumns } from '@/hooks/documents/table-columns/usePaymentsColumns';
import { usePayments } from '@/hooks/documents/usePayments';
import { useLibsStore } from '@/stores/useLibsStore';
import type { GetPaymentsDto } from '@/types/documents/payments.types';

export function PaymentsTable(): ReactNode {
  const { t } = useTranslation(['common', 'tables']);
  const [searchParams, setSearchParams] = useSearchParams();
  const companies = useLibsStore((s) => s.companies);

  const query = useMemo(
    () => ({
      company: parsePositiveInt(searchParams.get('company')),
      type: parseDocumentType(searchParams.get('type')),
    }),
    [searchParams],
  );

  const { data, loading, error } = usePayments(query);
  const columns: MRT_ColumnDef<GetPaymentsDto>[] = usePaymentsColumns();

  const title = useMemo(() => {
    const parts = [t('common:nav.payments')];

    if (query.company && companies[query.company]) {
      parts.push(companies[query.company]);
    }

    return parts.join(' || ');
  }, [companies, query.company, t]);

  const handleTypeChange = (type: DocumentTypeParam | undefined): void => {
    const next = new URLSearchParams(searchParams);
    if (type) {
      next.set('type', type);
    } else {
      next.delete('type');
    }
    setSearchParams(next);
  };

  const tableConfig: MRT_TableOptions<GetPaymentsDto> = {
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
          {query.company !== undefined && (
            <Group gap='xs' mb='sm' ml='xs'>
              <TypeFilters
                type={query.type}
                onTypeChange={handleTypeChange}
                mode='payment'
              />
            </Group>
          )}

          <HoldingTable
            tableOptions={tableConfig}
            title={title}
            toolBarControls={
              <Button component={Link} to={`${UrlConstants.PAYMENTS_URL}/new`}>
                {t('common:actions.create')}
              </Button>
            }
          />
        </>
      )}
    </>
  );
}
