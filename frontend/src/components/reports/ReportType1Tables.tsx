import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Stack, Table, Text, Title } from '@mantine/core';
import { UrlConstants } from '@/constants/url-constants';
import type { Type1Report, Type1Row } from '@/types/reports/month-report.types';

function SideTable({
  title,
  rows,
  totals,
}: {
  title: string;
  rows: Type1Row[];
  totals: Type1Report['incomeTotal'];
}): ReactNode {
  const { t } = useTranslation(['reports']);

  return (
    <Stack gap='xs'>
      <Title order={5}>{title}</Title>
      <Table withTableBorder withColumnBorders striped>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>{t('reports:invoice')}</Table.Th>
            <Table.Th>{t('reports:partner')}</Table.Th>
            <Table.Th>{t('reports:qty')}</Table.Th>
            <Table.Th>{t('reports:sum')}</Table.Th>
            <Table.Th>{t('reports:vat')}</Table.Th>
            <Table.Th>{t('reports:cost')}</Table.Th>
            <Table.Th>{t('reports:transport')}</Table.Th>
            <Table.Th>{t('reports:payments')}</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {rows.map((row) => {
            const qty = row.lines.reduce((a, l) => a + l.qty, 0);
            return (
              <Table.Tr key={row.invoice.id}>
                <Table.Td>
                  <Text
                    component={Link}
                    to={`${UrlConstants.INVOICES_URL}/${row.invoice.id}`}
                    size='sm'
                    td='underline'
                  >
                    {row.invoice.number}
                  </Text>
                </Table.Td>
                <Table.Td>{row.invoice.partner?.name}</Table.Td>
                <Table.Td>{qty}</Table.Td>
                <Table.Td>{row.sum}</Table.Td>
                <Table.Td>{row.vat}</Table.Td>
                <Table.Td>{row.cost}</Table.Td>
                <Table.Td>{row.transport}</Table.Td>
                <Table.Td>{row.paymentSum}</Table.Td>
              </Table.Tr>
            );
          })}
          <Table.Tr>
            <Table.Td colSpan={2}>
              <Text fw={600}>{t('reports:totals')}</Text>
            </Table.Td>
            <Table.Td fw={600}>{totals.qty}</Table.Td>
            <Table.Td fw={600}>{totals.sum}</Table.Td>
            <Table.Td fw={600}>{totals.vat}</Table.Td>
            <Table.Td fw={600}>{totals.cost}</Table.Td>
            <Table.Td fw={600}>{totals.transport}</Table.Td>
            <Table.Td fw={600}>{totals.pay}</Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </Stack>
  );
}

export function ReportType1Tables({ data }: { data: Type1Report }): ReactNode {
  const { t } = useTranslation(['reports']);
  return (
    <Stack gap='lg'>
      <SideTable
        title={t('reports:incomes')}
        rows={data.incomes}
        totals={data.incomeTotal}
      />
      <SideTable
        title={t('reports:outgoings')}
        rows={data.outgoings}
        totals={data.outgoingTotal}
      />
    </Stack>
  );
}
