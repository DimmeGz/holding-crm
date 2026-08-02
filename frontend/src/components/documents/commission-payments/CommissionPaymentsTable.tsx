import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from '@mantine/core';
import type { MRT_ColumnDef, MRT_TableOptions } from 'mantine-react-table';
import { HoldingTable } from '@/components/shared/HoldingTable';
import { Spinner } from '@/components/shared/Spinner';
import { UrlConstants } from '@/constants/url-constants';
import { useCommissionPaymentsColumns } from '@/hooks/documents/table-columns/useCommissionPaymentsColumns';
import { useCommissionPayments } from '@/hooks/documents/useCommissionPayments';
import type { GetCommissionPaymentsDto } from '@/types/documents/commission-payments.types';

export function CommissionPaymentsTable(): ReactNode {
  const { t } = useTranslation(['common', 'tables']);
  const { data, loading, error } = useCommissionPayments();
  const columns: MRT_ColumnDef<GetCommissionPaymentsDto>[] =
    useCommissionPaymentsColumns();
  const tableConfig: MRT_TableOptions<GetCommissionPaymentsDto> = {
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
          title={t('common:nav.commissioPayments')}
          toolBarControls={
            <Button
              component={Link}
              to={`${UrlConstants.COMMISSION_PAYMENTS_URL}/new`}
            >
              {t('common:actions.create')}
            </Button>
          }
        />
      )}
    </>
  );
}
