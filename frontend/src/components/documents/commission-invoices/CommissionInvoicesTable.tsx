import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import type { MRT_ColumnDef, MRT_TableOptions } from 'mantine-react-table';
import { HoldingTable } from '@/components/shared/HoldingTable';
import { Spinner } from '@/components/shared/Spinner';
import { useCommissionInvoicesColumns } from '@/hooks/documents/table-columns/useCommissionInvoicesColumns';
import { useCommissionInvoices } from '@/hooks/documents/useCommissionInvoices';
import type { GetCommissionInvoicesDto } from '@/types/documents/commission-invoices.types';

export function CommissionInvoicesTable(): ReactNode {
  const { t } = useTranslation(['common', 'tables']),
    { data, loading, error } = useCommissionInvoices(),
    columns: MRT_ColumnDef<GetCommissionInvoicesDto>[] =
      useCommissionInvoicesColumns(),
    tableConfig: MRT_TableOptions<GetCommissionInvoicesDto> = {
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
        />
      )}
    </>
  );
}
