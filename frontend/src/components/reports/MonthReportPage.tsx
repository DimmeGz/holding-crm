import { type ReactNode, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Link,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import {
  Button,
  Group,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { MonthDataSaveForm } from '@/components/reports/MonthDataSaveForm';
import { ReportType0Table } from '@/components/reports/ReportType0Table';
import { ReportType1Tables } from '@/components/reports/ReportType1Tables';
import { ReportType2Tables } from '@/components/reports/ReportType2Tables';
import { ReportType3Tables } from '@/components/reports/ReportType3Tables';
import { Spinner } from '@/components/shared/Spinner';
import { UrlConstants } from '@/constants/url-constants';
import { getErrorMessage } from '@/api/api-client';
import { useMonthReport } from '@/hooks/reports/useMonthReport';
import { ReportsService } from '@/services/reports/reports.service';
import { useLibsStore } from '@/stores/useLibsStore';

function currentYearMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

function shiftMonth(dateYYYYMM: string, delta: number): string {
  const [year, month] = dateYYYYMM.split('-').map(Number);
  const d = new Date(year, month - 1 + delta, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export function MonthReportPage(): ReactNode {
  const { t } = useTranslation(['reports', 'common', 'companies']);
  const { companyId: companyIdParam } = useParams<{ companyId: string }>();
  const companyId = Number(companyIdParam);
  const [searchParams, setSearchParams] = useSearchParams();

  const date = searchParams.get('date') || currentYearMonth();
  const processParam = searchParams.get('process');
  const process = processParam ? Number(processParam) : null;

  const technicalProcesses = useLibsStore((s) => s.technicalProcesses);
  const processEntries = useMemo(
    () =>
      Object.entries(technicalProcesses).map(([id, name]) => ({
        id: Number(id),
        name,
      })),
    [technicalProcesses],
  );

  const { data, loading, error, refetch } = useMonthReport(
    companyId,
    date,
    process,
  );
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const showProcessFilter =
    data?.reportType === 0 ||
    data?.reportType === 1 ||
    data?.reportType === 3 ||
    data == null;

  const canExportCsv =
    data != null &&
    (data.reportType === 0 ||
      data.reportType === 1 ||
      data.reportType === 3) &&
    process === null;

  const handleExportCsv = async (): Promise<void> => {
    setExporting(true);
    setExportError(null);
    try {
      await ReportsService.exportMonthReport(companyId, { date });
    } catch (err: unknown) {
      setExportError(getErrorMessage(err));
    } finally {
      setExporting(false);
    }
  };

  const setDate = (nextDate: string): void => {
    const next = new URLSearchParams(searchParams);
    next.set('date', nextDate);
    setSearchParams(next);
  };

  const handleProcessClick = (processId: number): void => {
    const next = new URLSearchParams(searchParams);
    if (process === processId) {
      next.delete('process');
    } else {
      next.set('process', String(processId));
    }
    if (!next.get('date')) {
      next.set('date', date);
    }
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
            {t('reports:title')}
            {data ? ` — ${data.company.name}` : ''}
          </Title>
        </div>
        {canExportCsv && (
          <Button
            variant='light'
            loading={exporting}
            onClick={() => {
              void handleExportCsv();
            }}
          >
            {t('reports:exportCsv')}
          </Button>
        )}
      </Group>
      {exportError && (
        <Text c='red' size='sm'>
          {t('common:messages.error')} {exportError}
        </Text>
      )}

      <Group>
        <Button
          variant='default'
          onClick={() => setDate(shiftMonth(date, -1))}
          aria-label={t('reports:prevMonth')}
        >
          &lt;
        </Button>
        <TextInput
          type='month'
          value={date}
          onChange={(event) => {
            if (event.currentTarget.value) {
              setDate(event.currentTarget.value);
            }
          }}
          maw={180}
        />
        <Button
          variant='default'
          onClick={() => setDate(shiftMonth(date, 1))}
          aria-label={t('reports:nextMonth')}
        >
          &gt;
        </Button>
      </Group>

      {showProcessFilter && data?.reportType !== 2 && (
        <Group gap='xs'>
          {processEntries.map((item) => (
            <Button
              key={item.id}
              size='xs'
              variant={process === item.id ? 'filled' : 'light'}
              onClick={() => handleProcessClick(item.id)}
            >
              {item.name}
            </Button>
          ))}
        </Group>
      )}

      {loading && <Spinner />}
      {!loading && error && (
        <h3>
          {t('common:messages.error')} {error}
        </h3>
      )}
      {!loading && !error && !data && (
        <h3>{t('common:messages.noData')}</h3>
      )}

      {!loading && !error && data && (
        <>
          {data.reportType === 0 && <ReportType0Table data={data} />}
          {data.reportType === 1 && <ReportType1Tables data={data} />}
          {data.reportType === 2 && <ReportType2Tables data={data} />}
          {data.reportType === 3 && <ReportType3Tables data={data} />}

          <MonthDataSaveForm
            companyId={companyId}
            date={date}
            reportType={data.reportType}
            process={process}
            monthData={data.monthData}
            onSaved={refetch}
          />
        </>
      )}
    </Stack>
  );
}
