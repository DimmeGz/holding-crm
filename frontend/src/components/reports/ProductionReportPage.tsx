import { type ReactNode, useMemo } from 'react';
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
  Table,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { Spinner } from '@/components/shared/Spinner';
import { UrlConstants } from '@/constants/url-constants';
import { useProductionReport } from '@/hooks/reports/useProductionReport';
import { useLibsStore } from '@/stores/useLibsStore';
import type {
  ProductionReportDoc,
} from '@/types/reports/production-report.types';

function currentYearMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

function shiftMonth(dateYYYYMM: string, delta: number): string {
  const [year, month] = dateYYYYMM.split('-').map(Number);
  const d = new Date(year, month - 1 + delta, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function formatDate(value: string | null): string {
  if (!value) {
    return '';
  }
  return new Date(value).toLocaleDateString('uk-UA');
}

function ProductionTable({
  title,
  docs,
  totalQty,
  showBatchReportLink,
}: {
  title: string;
  docs: ProductionReportDoc[];
  totalQty: number;
  showBatchReportLink: boolean;
}): ReactNode {
  const { t } = useTranslation(['reports', 'common']);

  if (docs.length === 0) {
    return null;
  }

  return (
    <Stack gap='xs'>
      <Title order={4}>{title}</Title>
      <Table withTableBorder withColumnBorders striped style={{ fontSize: 12 }}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>{t('reports:productionDoc')}</Table.Th>
            <Table.Th>{t('reports:product')}</Table.Th>
            <Table.Th>{t('reports:batch')}</Table.Th>
            <Table.Th>{t('reports:qty')}</Table.Th>
            <Table.Th>{t('reports:linkedInvoices')}</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {docs.map((doc) =>
            doc.lines.map((line, idx) => (
              <Table.Tr key={`${doc.id}-${line.id}`}>
                {idx === 0 && (
                  <Table.Td rowSpan={doc.lines.length}>
                    <Text
                      component={Link}
                      to={`${UrlConstants.PRODUCTION_URL}/${doc.id}`}
                      size='sm'
                      td='underline'
                    >
                      #{doc.id}
                    </Text>
                    <Text size='xs' c='dimmed'>
                      {formatDate(doc.expectedDate)}
                    </Text>
                  </Table.Td>
                )}
                <Table.Td>{line.product?.name ?? ''}</Table.Td>
                <Table.Td>
                  {line.batch ? (
                    showBatchReportLink ? (
                      <Text
                        component={Link}
                        to={`${UrlConstants.BATCH_REPORT_URL}/${line.batch.id}`}
                        size='sm'
                        td='underline'
                      >
                        {line.batch.name}
                      </Text>
                    ) : (
                      line.batch.name
                    )
                  ) : (
                    ''
                  )}
                </Table.Td>
                <Table.Td>{line.qty}</Table.Td>
                <Table.Td>
                  {line.invoices.map((invoice) => (
                    <Text
                      key={invoice.id}
                      component={Link}
                      to={`${UrlConstants.INVOICES_URL}/${invoice.id}`}
                      size='sm'
                      td='underline'
                      display='block'
                    >
                      {invoice.number}
                    </Text>
                  ))}
                </Table.Td>
              </Table.Tr>
            )),
          )}
          <Table.Tr>
            <Table.Td colSpan={3} fw={600}>
              {t('reports:totals')}
            </Table.Td>
            <Table.Td fw={600}>{totalQty}</Table.Td>
            <Table.Td />
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </Stack>
  );
}

export function ProductionReportPage(): ReactNode {
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

  const { data, loading, error } = useProductionReport(
    companyId,
    date,
    process,
  );

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
            {t('reports:productionReport')}
            {data ? ` — ${data.company.name}` : ''}
          </Title>
        </div>
      </Group>

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
          <ProductionTable
            title={t('reports:consumed')}
            docs={data.outProductions}
            totalQty={data.outQty}
            showBatchReportLink
          />
          <ProductionTable
            title={t('reports:produced')}
            docs={data.inProductions}
            totalQty={data.inQty}
            showBatchReportLink={false}
          />
          {data.outProductions.length === 0 &&
            data.inProductions.length === 0 && (
              <h3>{t('common:messages.noData')}</h3>
            )}
        </>
      )}
    </Stack>
  );
}
