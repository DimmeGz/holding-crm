import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Stack, Table, Text, Title } from '@mantine/core';
import type { Type2Report } from '@/types/reports/month-report.types';

function ProductTable({
  title,
  rows,
  qty,
  sum,
}: {
  title: string;
  rows: Type2Report['incomes'];
  qty: number;
  sum: number;
}): ReactNode {
  const { t } = useTranslation(['reports']);
  return (
    <Stack gap='xs'>
      <Title order={5}>{title}</Title>
      <Table withTableBorder withColumnBorders striped>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>{t('reports:product')}</Table.Th>
            <Table.Th>{t('reports:qty')}</Table.Th>
            <Table.Th>{t('reports:sum')}</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {rows.map((row) => (
            <Table.Tr key={row.productId}>
              <Table.Td>{row.productName}</Table.Td>
              <Table.Td>{row.qty}</Table.Td>
              <Table.Td>{row.sum}</Table.Td>
            </Table.Tr>
          ))}
          <Table.Tr>
            <Table.Td>
              <Text fw={600}>{t('reports:totals')}</Text>
            </Table.Td>
            <Table.Td fw={600}>{qty}</Table.Td>
            <Table.Td fw={600}>{sum}</Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </Stack>
  );
}

export function ReportType2Tables({ data }: { data: Type2Report }): ReactNode {
  const { t } = useTranslation(['reports']);
  return (
    <Stack gap='lg'>
      <ProductTable
        title={t('reports:incomes')}
        rows={data.incomes}
        qty={data.inQty}
        sum={data.inSum}
      />
      <ProductTable
        title={t('reports:outgoings')}
        rows={data.outgoings}
        qty={data.outQty}
        sum={data.outSum}
      />
    </Stack>
  );
}
