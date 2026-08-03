import { type ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router-dom';
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
import { useTechnoReport } from '@/hooks/reports/useTechnoReport';
import { useLibsStore } from '@/stores/useLibsStore';
import type {
  TechnoDyumansRow,
  TechnoMarginRow,
  TechnoSectionTotals,
} from '@/types/reports/techno-report.types';

function monthStartISODate(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
}

function todayISODate(): string {
  return new Date().toISOString().slice(0, 10);
}

function formatDate(value: string | null): string {
  if (!value) {
    return '';
  }
  return new Date(value).toLocaleDateString('uk-UA');
}

function DyumansTable({
  title,
  rows,
  totals,
}: {
  title: string;
  rows: TechnoDyumansRow[];
  totals: TechnoSectionTotals;
}): ReactNode {
  const { t } = useTranslation(['reports']);
  if (rows.length === 0) {
    return null;
  }

  return (
    <Stack gap='xs'>
      <Title order={4}>{title}</Title>
      <Table withTableBorder withColumnBorders striped style={{ fontSize: 12 }}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>{t('reports:seller')}</Table.Th>
            <Table.Th>{t('reports:invoice')}</Table.Th>
            <Table.Th>{t('reports:product')}</Table.Th>
            <Table.Th>{t('reports:qty')}</Table.Th>
            <Table.Th>{t('reports:sum')}</Table.Th>
            <Table.Th>{t('reports:buyer')}</Table.Th>
            <Table.Th>{t('reports:invoice')}</Table.Th>
            <Table.Th>{t('reports:sum')}</Table.Th>
            <Table.Th>{t('reports:transport')}</Table.Th>
            <Table.Th>{t('reports:delta')}</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {rows.map((row) => (
            <Table.Tr key={row.invoiceId}>
              <Table.Td>
                <Text size='xs' c='dimmed'>
                  {formatDate(row.expectedDate)}
                </Text>
                {row.seller?.name}
              </Table.Td>
              <Table.Td>
                <Text
                  component={Link}
                  to={`${UrlConstants.INVOICES_URL}/${row.invoiceId}`}
                  size='sm'
                  td='underline'
                >
                  {row.invoiceNumber}
                </Text>
              </Table.Td>
              <Table.Td>
                {row.lines.map((line, idx) => (
                  <Text key={idx} size='sm'>
                    {line.productName}
                  </Text>
                ))}
              </Table.Td>
              <Table.Td>
                {row.lines.map((line, idx) => (
                  <Text key={idx} size='sm'>
                    {line.qty}
                  </Text>
                ))}
              </Table.Td>
              <Table.Td>
                {row.inSum} {row.currency}
              </Table.Td>
              <Table.Td>
                <Text size='xs' c='dimmed'>
                  {formatDate(row.childExpectedDate)}
                </Text>
                {row.childBuyer?.name}
              </Table.Td>
              <Table.Td>
                <Text
                  component={Link}
                  to={`${UrlConstants.INVOICES_URL}/${row.childInvoiceId}`}
                  size='sm'
                  td='underline'
                >
                  {row.childInvoiceNumber}
                </Text>
              </Table.Td>
              <Table.Td>
                {row.outSum} {row.currency}
              </Table.Td>
              <Table.Td>
                {row.transport ? `${row.transport} ${row.currency ?? ''}` : ''}
              </Table.Td>
              <Table.Td>
                {row.delta} {row.currency}
              </Table.Td>
            </Table.Tr>
          ))}
          <Table.Tr>
            <Table.Td colSpan={3} fw={600}>
              {t('reports:totals')}
            </Table.Td>
            <Table.Td fw={600}>{totals.weight}</Table.Td>
            <Table.Td fw={600}>{totals.inSum ?? totals.sum}</Table.Td>
            <Table.Td colSpan={2} />
            <Table.Td fw={600}>{totals.outSum}</Table.Td>
            <Table.Td fw={600}>{totals.transport}</Table.Td>
            <Table.Td fw={600}>{totals.delta}</Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </Stack>
  );
}

function MarginTable({
  title,
  rows,
  totals,
  showDelta,
}: {
  title: string;
  rows: TechnoMarginRow[];
  totals: TechnoSectionTotals;
  showDelta: boolean;
}): ReactNode {
  const { t } = useTranslation(['reports']);
  if (rows.length === 0) {
    return null;
  }

  return (
    <Stack gap='xs'>
      <Title order={4}>{title}</Title>
      <Table withTableBorder withColumnBorders striped style={{ fontSize: 12 }}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>{t('reports:partner')}</Table.Th>
            <Table.Th>{t('reports:invoice')}</Table.Th>
            <Table.Th>{t('reports:product')}</Table.Th>
            <Table.Th>{t('reports:qty')}</Table.Th>
            <Table.Th>{t('reports:sum')}</Table.Th>
            <Table.Th>{t('reports:transport')}</Table.Th>
            {showDelta && <Table.Th>{t('reports:delta')}</Table.Th>}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {rows.map((row) => (
            <Table.Tr key={row.invoiceId}>
              <Table.Td>
                <Text size='xs' c='dimmed'>
                  {formatDate(row.expectedDate)}
                </Text>
                {row.partner?.name}
              </Table.Td>
              <Table.Td>
                <Text
                  component={Link}
                  to={`${UrlConstants.INVOICES_URL}/${row.invoiceId}`}
                  size='sm'
                  td='underline'
                >
                  {row.invoiceNumber}
                </Text>
              </Table.Td>
              <Table.Td>
                {row.lines.map((line, idx) => (
                  <Text key={idx} size='sm'>
                    {line.productName}
                  </Text>
                ))}
              </Table.Td>
              <Table.Td>
                {row.lines.map((line, idx) => (
                  <Text key={idx} size='sm'>
                    {line.qty}
                  </Text>
                ))}
              </Table.Td>
              <Table.Td>
                {row.sum} {row.currency}
              </Table.Td>
              <Table.Td>
                {row.transport ? `${row.transport} ${row.currency ?? ''}` : ''}
              </Table.Td>
              {showDelta && (
                <Table.Td>
                  {row.delta} {row.currency}
                </Table.Td>
              )}
            </Table.Tr>
          ))}
          <Table.Tr>
            <Table.Td colSpan={3} fw={600}>
              {t('reports:totals')}
            </Table.Td>
            <Table.Td fw={600}>{totals.weight}</Table.Td>
            <Table.Td fw={600}>{totals.sum}</Table.Td>
            <Table.Td fw={600}>{totals.transport}</Table.Td>
            {showDelta && <Table.Td fw={600}>{totals.delta}</Table.Td>}
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </Stack>
  );
}

export function TechnoReportPage(): ReactNode {
  const { t } = useTranslation(['reports', 'common']);
  const [searchParams, setSearchParams] = useSearchParams();

  const startDate = searchParams.get('startDate') || monthStartISODate();
  const endDate = searchParams.get('endDate') || todayISODate();
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

  const { data, loading, error } = useTechnoReport(
    startDate,
    endDate,
    process,
  );

  const updateParam = (key: string, value: string): void => {
    const next = new URLSearchParams(searchParams);
    next.set(key, value);
    setSearchParams(next);
  };

  const handleProcessClick = (processId: number): void => {
    const next = new URLSearchParams(searchParams);
    next.set('process', String(processId));
    if (!next.get('startDate')) {
      next.set('startDate', startDate);
    }
    if (!next.get('endDate')) {
      next.set('endDate', endDate);
    }
    setSearchParams(next);
  };

  const companyLabel = (section: {
    company: { name: string } | null;
  }): string => section.company?.name ?? '';

  return (
    <Stack p='md' gap='md'>
      <Title order={3}>{t('reports:technoReport')}</Title>

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

      <Group>
        <TextInput
          type='date'
          value={startDate}
          onChange={(event) => {
            if (event.currentTarget.value) {
              updateParam('startDate', event.currentTarget.value);
            }
          }}
          maw={180}
        />
        <TextInput
          type='date'
          value={endDate}
          onChange={(event) => {
            if (event.currentTarget.value) {
              updateParam('endDate', event.currentTarget.value);
            }
          }}
          maw={180}
        />
      </Group>

      {process === null && (
        <Text c='dimmed'>{t('reports:selectProcess')}</Text>
      )}

      {process !== null && loading && <Spinner />}
      {process !== null && !loading && error && (
        <h3>
          {t('common:messages.error')} {error}
        </h3>
      )}
      {process !== null && !loading && !error && data && (
        <>
          <DyumansTable
            title={`${t('reports:technoDyumans')} ${companyLabel(data.dyumans)}`}
            rows={data.dyumans.rows}
            totals={data.dyumans.totals}
          />
          <MarginTable
            title={`${t('reports:technoEwbIn')} ${companyLabel(data.ewbIn)}`}
            rows={data.ewbIn.rows}
            totals={data.ewbIn.totals}
            showDelta={false}
          />
          <MarginTable
            title={`${t('reports:technoEwbOut')} ${companyLabel(data.ewbOut)}`}
            rows={data.ewbOut.rows}
            totals={data.ewbOut.totals}
            showDelta
          />
          <MarginTable
            title={`${t('reports:technoKlimana')} ${companyLabel(data.klimana)}`}
            rows={data.klimana.rows}
            totals={data.klimana.totals}
            showDelta
          />
          {data.dyumans.rows.length === 0 &&
            data.ewbIn.rows.length === 0 &&
            data.ewbOut.rows.length === 0 &&
            data.klimana.rows.length === 0 && (
              <h3>{t('common:messages.noData')}</h3>
            )}
        </>
      )}
    </Stack>
  );
}
