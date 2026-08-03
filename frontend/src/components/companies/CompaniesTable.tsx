import { type ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { MRT_ColumnDef, MRT_TableOptions } from 'mantine-react-table';
import { HoldingTable } from '@/components/shared/HoldingTable';
import { Spinner } from '@/components/shared/Spinner';
import { flattenCompanyAccounts } from '@/helpers/companies.helpers';
import { useCompaniesColumns } from '@/hooks/companies/table-columns/useCompaniesColumns';
import { useCompanies } from '@/hooks/companies/useCompanies';
import type { CompanyAccountRow } from '@/types/companies/companies.types';

export function CompaniesTable(): ReactNode {
  const { t } = useTranslation(['common', 'companies']);
  const { data, loading, error } = useCompanies();
  const columns: MRT_ColumnDef<CompanyAccountRow>[] = useCompaniesColumns();

  const rows = useMemo(() => flattenCompanyAccounts(data ?? []), [data]);

  const tableConfig: MRT_TableOptions<CompanyAccountRow> = useMemo(
    () => ({
      data: rows,
      columns,
      mantineTableContainerProps: {
        style: {
          height: '87vh',
        },
      },
    }),
    [columns, rows],
  );

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
          title={t('companies:title')}
        />
      )}
    </>
  );
}
