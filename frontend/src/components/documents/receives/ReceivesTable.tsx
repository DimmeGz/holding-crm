import { type ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button, Group } from '@mantine/core';
import type { MRT_ColumnDef, MRT_TableOptions } from 'mantine-react-table';
import {
  QuarterFilters,
  TypeFilters,
} from '@/components/documents/common/DocumentListFilters';
import { HoldingTable } from '@/components/shared/HoldingTable';
import { Spinner } from '@/components/shared/Spinner';
import { UrlConstants } from '@/constants/url-constants';
import { useReceivesColumns } from '@/hooks/documents/table-columns/useReceivesColumns';
import { useDatedDocumentsListQuery } from '@/hooks/documents/useDatedDocumentsListQuery';
import { useReceives } from '@/hooks/documents/useReceives';
import { useLibsStore } from '@/stores/useLibsStore';
import type { GetReceivesDto } from '@/types/documents/receives.types';

export function ReceivesTable(): ReactNode {
  const { t } = useTranslation(['common', 'tables']);
  const companies = useLibsStore((s) => s.companies);
  const { query, company, type, date, handleTypeChange, handleDateChange } =
    useDatedDocumentsListQuery();

  const { data, loading, error } = useReceives(query);
  const columns: MRT_ColumnDef<GetReceivesDto>[] = useReceivesColumns();

  const title = useMemo(() => {
    const parts = [t('common:nav.receives')];

    if (company && companies[company]) {
      parts.push(companies[company]);
    }

    if (date) {
      parts.push(date === 'old' ? t('common:filters.old') : date);
    }

    return parts.join(' || ');
  }, [companies, company, date, t]);

  const tableConfig: MRT_TableOptions<GetReceivesDto> = {
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
            {company !== undefined && (
              <TypeFilters type={type} onTypeChange={handleTypeChange} />
            )}
            <QuarterFilters date={date} onDateChange={handleDateChange} />
          </Group>

          <HoldingTable
            tableOptions={tableConfig}
            title={title}
            toolBarControls={
              <Button component={Link} to={`${UrlConstants.RECEIVES_URL}/new`}>
                {t('common:actions.create')}
              </Button>
            }
          />
        </>
      )}
    </>
  );
}
