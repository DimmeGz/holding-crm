import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from '@mantine/core';
import type { MRT_ColumnDef, MRT_TableOptions } from 'mantine-react-table';
import { HoldingTable } from '@/components/shared/HoldingTable';
import { Spinner } from '@/components/shared/Spinner';
import { UrlConstants } from '@/constants/url-constants';
import { useInvoicesColumns } from '@/hooks/documents/table-columns/useInvoicesColumns';
import { useInvoices } from '@/hooks/documents/useInvoices';
import type { GetInvoicesDto } from '@/types/documents/invoices.types';

export function InvoicesTable(): ReactNode {
  const { t } = useTranslation(['common', 'tables']);
  const { data, loading, error } = useInvoices();
  const columns: MRT_ColumnDef<GetInvoicesDto>[] = useInvoicesColumns();
  const tableConfig: MRT_TableOptions<GetInvoicesDto> = {
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
          title={t('common:nav.invoices')}
          toolBarControls={
            <Button component={Link} to={`${UrlConstants.INVOICES_URL}/new`}>
              {t('common:actions.create')}
            </Button>
          }
        />
      )}
    </>
  );
}
