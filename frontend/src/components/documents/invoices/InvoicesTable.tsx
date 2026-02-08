import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import type { MRT_ColumnDef, MRT_TableOptions } from 'mantine-react-table';
import { HoldingTable } from '@/components/shared/HoldingTable';
import { Spinner } from '@/components/shared/Spinner';
import { useInvoicesColumns } from '@/hooks/documents/table-columns/useInvoicesColumns';
import { useInvoices } from '@/hooks/documents/useInvoices';
import type { GetInvoicesDto } from '@/types/documents/invoices.types';

export function InvoicesTable(): ReactNode {
  const { t } = useTranslation(['common', 'tables']),
    columns: MRT_ColumnDef<GetInvoicesDto>[] = useInvoicesColumns(),
    { data, loading, error } = useInvoices(),
    tableConfig: MRT_TableOptions<GetInvoicesDto> = {
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

      {!loading && error && <h3>Помилка завантаження даних: {error}</h3>}

      {!loading && !error && (
        <HoldingTable
          tableOptions={tableConfig}
          title={t('common:nav.invoices')}
        />
      )}
    </>
  );
}
