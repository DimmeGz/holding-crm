import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Table } from '@mantine/core';
import {
  YEAR_BLOCKS,
  formatAmount,
  monthLabel,
  monthToYearMonth,
} from '@/components/reports/year-report.helpers';
import { UrlConstants } from '@/constants/url-constants';
import type { YearReportType3 } from '@/types/reports/year-report.types';

type Props = {
  data: YearReportType3;
  companyId: number;
};

export function YearReportType3Table({ data, companyId }: Props): ReactNode {
  const { t, i18n } = useTranslation(['reports']);

  return (
    <Table withTableBorder withColumnBorders striped style={{ fontSize: 12 }}>
      {YEAR_BLOCKS.map((block) => {
        const quarter = data.quarters[block.key];
        const months = data.months.filter((m) =>
          block.months.includes(m.monthNumber),
        );
        return (
          <Table.Tbody key={block.key}>
            <Table.Tr>
              <Table.Th />
              <Table.Th>{t('reports:salesVolume')}</Table.Th>
              <Table.Th>{t('reports:purchase')}</Table.Th>
              <Table.Th>{t('reports:transportCosts')}</Table.Th>
              <Table.Th>{t('reports:operatingOutgoings')}</Table.Th>
              <Table.Th>{t('reports:vatReturn')}</Table.Th>
              <Table.Th>{t('reports:vat')}</Table.Th>
              <Table.Th>Debt</Table.Th>
              <Table.Th>Credit of Supplier</Table.Th>
              <Table.Th>Saldo</Table.Th>
              <Table.Th>Profit</Table.Th>
            </Table.Tr>
            {months.map((item) => (
              <Table.Tr key={item.month}>
                <Table.Th>
                  <Link
                    to={`${UrlConstants.MONTH_REPORT_URL}/${companyId}?date=${monthToYearMonth(item.month)}`}
                  >
                    {monthLabel(item.month, i18n.language)}
                  </Link>
                </Table.Th>
                <Table.Td>{formatAmount(item.outPay)}</Table.Td>
                <Table.Td>{formatAmount(item.inPay)}</Table.Td>
                <Table.Td>{formatAmount(item.transport)}</Table.Td>
                <Table.Td>{formatAmount(item.operatingOutgoings)}</Table.Td>
                <Table.Td>
                  {formatAmount(item.vatReturn)}{' '}
                  {item.isVatFact
                    ? t('reports:vatFact')
                    : t('reports:vatCalculated')}
                </Table.Td>
                <Table.Td>{formatAmount(item.vat)}</Table.Td>
                <Table.Td>{formatAmount(item.debt)}</Table.Td>
                <Table.Td>{formatAmount(item.suplCredit)}</Table.Td>
                <Table.Td>{formatAmount(item.saldo)}</Table.Td>
                <Table.Td>{formatAmount(item.profit)}</Table.Td>
              </Table.Tr>
            ))}
            <Table.Tr>
              <Table.Th>{t(`reports:${block.ytdLabelKey}`)}</Table.Th>
              <Table.Td>{formatAmount(quarter.total)}</Table.Td>
              <Table.Td>{formatAmount(quarter.inSum)}</Table.Td>
              <Table.Td>{formatAmount(quarter.inTransport)}</Table.Td>
              <Table.Td>{formatAmount(quarter.operatingOutgoings)}</Table.Td>
              <Table.Td>{formatAmount(quarter.vatReturn)}</Table.Td>
              <Table.Td>{formatAmount(quarter.vat)}</Table.Td>
              <Table.Td>{formatAmount(quarter.debt)}</Table.Td>
              <Table.Td>{formatAmount(quarter.suplCredit)}</Table.Td>
              <Table.Td>
                {formatAmount(quarter.debt - quarter.suplCredit)}
              </Table.Td>
              <Table.Td>{formatAmount(quarter.delta)}</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td colSpan={11} h={40} />
            </Table.Tr>
          </Table.Tbody>
        );
      })}
    </Table>
  );
}
