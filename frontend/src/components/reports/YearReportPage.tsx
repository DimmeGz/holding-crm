import { type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { Button, Group, Stack, Text, Title } from '@mantine/core';
import { YearReportSummary } from '@/components/reports/YearReportSummary';
import { YearReportType0Table } from '@/components/reports/YearReportType0Table';
import { YearReportType1Table } from '@/components/reports/YearReportType1Table';
import { YearReportType3Table } from '@/components/reports/YearReportType3Table';
import { yearList } from '@/components/reports/year-report.helpers';
import { Spinner } from '@/components/shared/Spinner';
import { UrlConstants } from '@/constants/url-constants';
import { useYearReport } from '@/hooks/reports/useYearReport';

function currentYear(): string {
  return String(new Date().getFullYear());
}

export function YearReportPage(): ReactNode {
  const { t } = useTranslation(['reports', 'common', 'companies']);
  const { companyId: companyIdParam } = useParams<{ companyId: string }>();
  const companyId = Number(companyIdParam);
  const [searchParams, setSearchParams] = useSearchParams();
  const year = searchParams.get('date') || currentYear();

  const { data, loading, error, refetch } = useYearReport(companyId, year);

  const setYear = (nextYear: number): void => {
    const next = new URLSearchParams(searchParams);
    next.set('date', String(nextYear));
    setSearchParams(next);
  };

  if (!Number.isFinite(companyId) || companyId <= 0) {
    return <h3>{t('common:messages.noData')}</h3>;
  }

  return (
    <Stack p='md' gap='md'>
      <Group justify='space-between'>
        <div>
          <Text
            component={Link}
            to={`${UrlConstants.COMPANIES_URL}/${companyId}`}
            size='sm'
            c='dimmed'
            td='underline'
          >
            {data?.company.name ?? t('companies:title')}
          </Text>
          <Title order={3}>
            {t('reports:yearReport')}
            {data ? ` — ${data.company.name}` : ''}
            {` (${year})`}
          </Title>
        </div>
      </Group>

      <Group gap='xs'>
        {yearList().map((y) => (
          <Button
            key={y}
            size='xs'
            variant={String(y) === year ? 'filled' : 'light'}
            onClick={() => setYear(y)}
          >
            {y}
          </Button>
        ))}
      </Group>

      {loading && <Spinner />}
      {!loading && error && (
        <h3>
          {t('common:messages.error')} {error}
        </h3>
      )}
      {!loading && !error && !data && (
        <h3>{t('common:messages.noData')}</h3>
      )}

      {!loading && !error && data && !data.supported && (
        <Text>{t('reports:yearReportUnsupported')}</Text>
      )}

      {!loading && !error && data && data.supported && (
        <>
          {data.reportType === 0 && (
            <YearReportType0Table data={data} companyId={companyId} />
          )}
          {data.reportType === 1 && (
            <YearReportType1Table data={data} companyId={companyId} />
          )}
          {data.reportType === 3 && (
            <YearReportType3Table data={data} companyId={companyId} />
          )}
          <YearReportSummary
            data={data}
            companyId={companyId}
            onSaved={refetch}
          />
        </>
      )}
    </Stack>
  );
}
