import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Stack, Table, Text, Title } from '@mantine/core';
import { UrlConstants } from '@/constants/url-constants';
import type {
  Type3LineRow,
  Type3Report,
} from '@/types/reports/month-report.types';

function LinesTable({
  title,
  rows,
}: {
  title: string;
  rows: Type3LineRow[];
}): ReactNode {
  const { t } = useTranslation(['reports']);
  return (
    <Stack gap='xs'>
      <Title order={5}>{title}</Title>
      <Table withTableBorder withColumnBorders striped style={{ fontSize: 12 }}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>{t('reports:invoice')}</Table.Th>
            <Table.Th>{t('reports:partner')}</Table.Th>
            <Table.Th>{t('reports:product')}</Table.Th>
            <Table.Th>{t('reports:service')}</Table.Th>
            <Table.Th>{t('reports:qty')}</Table.Th>
            <Table.Th>{t('reports:sum')}</Table.Th>
            <Table.Th>{t('reports:transport')}</Table.Th>
            <Table.Th>{t('reports:payments')}</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {rows.map((row) => (
            <Table.Tr key={`${row.lineId}-${row.isDouble ? 'd' : 'n'}`}>
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
              <Table.Td>{row.partner?.name}</Table.Td>
              <Table.Td>{row.productName}</Table.Td>
              <Table.Td>{row.serviceName}</Table.Td>
              <Table.Td>{row.qty}</Table.Td>
              <Table.Td>{(row.qty * row.price).toFixed(3)}</Table.Td>
              <Table.Td>{row.transport}</Table.Td>
              <Table.Td>{row.paySum}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Stack>
  );
}

function QuarterBlock({ data }: { data: NonNullable<Type3Report['quarter']> }): ReactNode {
  const { t } = useTranslation(['reports']);
  const groups: Array<{
    name: string;
    rows: Array<{ productName: string; buyers: Record<string, number> }>;
    companies: string[];
  }> = [
    {
      name: 'CLEARON',
      rows: data.CLEARON,
      companies: data.clearonCompanies,
    },
    {
      name: 'FLOTRON',
      rows: data.FLOTRON,
      companies: data.flotronCompanies,
    },
    {
      name: 'FERROFORM',
      rows: data.FERROFORM,
      companies: data.ferroformCompanies,
    },
  ];

  return (
    <Stack gap='md'>
      <Title order={5}>{t('reports:quarterBlock')}</Title>
      {groups.map((group) =>
        group.rows.length === 0 ? null : (
          <Stack key={group.name} gap='xs'>
            <Text fw={600}>{group.name}</Text>
            <Table withTableBorder withColumnBorders>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>{t('reports:product')}</Table.Th>
                  {group.companies.map((company) => (
                    <Table.Th key={company}>{company}</Table.Th>
                  ))}
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {group.rows.map((row) => (
                  <Table.Tr key={row.productName}>
                    <Table.Td>{row.productName}</Table.Td>
                    {group.companies.map((company) => (
                      <Table.Td key={company}>
                        {row.buyers[company] ?? 0}
                      </Table.Td>
                    ))}
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Stack>
        ),
      )}
    </Stack>
  );
}

export function ReportType3Tables({ data }: { data: Type3Report }): ReactNode {
  const { t } = useTranslation(['reports']);
  return (
    <Stack gap='lg'>
      <LinesTable title={t('reports:incomes')} rows={data.inLines} />
      <LinesTable
        title={`${t('reports:incomes')} / ${t('reports:service')}`}
        rows={data.inServiceLines}
      />
      <LinesTable title={t('reports:outgoings')} rows={data.outLines} />
      <LinesTable
        title={`${t('reports:outgoings')} / ${t('reports:service')}`}
        rows={data.outServiceLines}
      />
      {data.doubleServiceLines.length > 0 && (
        <LinesTable
          title={t('reports:doubles')}
          rows={data.doubleServiceLines}
        />
      )}
      <Text size='sm'>
        {t('reports:totals')}: in {data.inSum} / out {data.outSum} / doubled{' '}
        {data.doubledSum}
      </Text>
      {data.quarter && <QuarterBlock data={data.quarter} />}
    </Stack>
  );
}
