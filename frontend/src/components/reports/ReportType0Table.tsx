import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Table, Text } from '@mantine/core';
import { UrlConstants } from '@/constants/url-constants';
import type { Type0Report } from '@/types/reports/month-report.types';

export function ReportType0Table({ data }: { data: Type0Report }): ReactNode {
  const { t } = useTranslation(['reports']);

  return (
    <Table withTableBorder withColumnBorders striped style={{ fontSize: 12 }}>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>{t('reports:orders')}</Table.Th>
          <Table.Th>{t('reports:seller')}</Table.Th>
          <Table.Th>{t('reports:qty')}</Table.Th>
          <Table.Th>{t('reports:invoice')}</Table.Th>
          <Table.Th>{t('reports:sum')}</Table.Th>
          <Table.Th>{t('reports:payments')}</Table.Th>
          <Table.Th>{t('reports:outgoings')}</Table.Th>
          <Table.Th>{t('reports:buyer')}</Table.Th>
          <Table.Th>{t('reports:sum')}</Table.Th>
          <Table.Th>{t('reports:transport')}</Table.Th>
          <Table.Th>{t('reports:payments')}</Table.Th>
          <Table.Th>{t('reports:delta')}</Table.Th>
          <Table.Th>{t('reports:commission')}</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {data.lines.map((row) => (
          <Table.Tr key={`${row.inInvoice.id}-${row.orderIds.join('-')}`}>
            <Table.Td>
              {row.orderIds.map((id, idx) => (
                <Text
                  key={id}
                  component={Link}
                  to={`${UrlConstants.ORDERS_URL}/${id}`}
                  size='sm'
                  td='underline'
                  display='block'
                >
                  {row.orderNumbers[idx] ?? id}
                </Text>
              ))}
            </Table.Td>
            <Table.Td>{row.seller?.name}</Table.Td>
            <Table.Td>{row.qty}</Table.Td>
            <Table.Td>
              <Text
                component={Link}
                to={`${UrlConstants.INVOICES_URL}/${row.inInvoice.id}`}
                size='sm'
                td='underline'
              >
                {row.inInvoice.number}
              </Text>
            </Table.Td>
            <Table.Td>{row.inInvoiceSum}</Table.Td>
            <Table.Td>{row.inPaymentSum}</Table.Td>
            <Table.Td>
              {row.outInvoices.map((inv) => (
                <Text
                  key={inv.id}
                  component={Link}
                  to={`${UrlConstants.INVOICES_URL}/${inv.id}`}
                  size='sm'
                  td='underline'
                  display='block'
                >
                  {inv.number}
                </Text>
              ))}
            </Table.Td>
            <Table.Td>
              {row.outInvoices.map((inv) => (
                <Text key={`b-${inv.id}`} size='sm' display='block'>
                  {inv.buyer?.name}
                </Text>
              ))}
            </Table.Td>
            <Table.Td>{row.outInvoiceSum}</Table.Td>
            <Table.Td>{row.outTransportSum}</Table.Td>
            <Table.Td>{row.outPaymentSum}</Table.Td>
            <Table.Td>{row.delta}</Table.Td>
            <Table.Td>{row.comSum}</Table.Td>
          </Table.Tr>
        ))}
        <Table.Tr>
          <Table.Td colSpan={2}>
            <Text fw={600}>{t('reports:totals')}</Text>
          </Table.Td>
          <Table.Td fw={600}>{data.totals.qty}</Table.Td>
          <Table.Td />
          <Table.Td fw={600}>{data.totals.inSum}</Table.Td>
          <Table.Td fw={600}>{data.totals.inPaySum}</Table.Td>
          <Table.Td colSpan={2} />
          <Table.Td fw={600}>{data.totals.outSum}</Table.Td>
          <Table.Td fw={600}>{data.totals.outTransportSum}</Table.Td>
          <Table.Td fw={600}>{data.totals.outPaySum}</Table.Td>
          <Table.Td fw={600}>{data.totals.delta}</Table.Td>
          <Table.Td fw={600}>{data.totals.comSum}</Table.Td>
        </Table.Tr>
      </Table.Tbody>
    </Table>
  );
}
