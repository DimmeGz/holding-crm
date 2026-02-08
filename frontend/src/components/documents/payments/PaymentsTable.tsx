import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import type { MRT_ColumnDef, MRT_TableOptions } from 'mantine-react-table';
import { HoldingTable } from '@/components/shared/HoldingTable';
import { Spinner } from '@/components/shared/Spinner';
import { usePaymentsColumns } from '@/hooks/documents/table-columns/usePaymentsColumns';
import { usePayments } from '@/hooks/documents/usePayments';
import type { GetPaymentsDto } from '@/types/documents/payments.types';

export function PaymentsTable(): ReactNode {
  const { t } = useTranslation(['common', 'tables']),
    columns: MRT_ColumnDef<GetPaymentsDto>[] = usePaymentsColumns(),
    { data, loading, error } = usePayments(),
    tableConfig: MRT_TableOptions<GetPaymentsDto> = {
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
          title={t('common:nav.payments')}
        />
      )}
    </>
  );
}
