import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Table } from '@mantine/core';
import {
  YEAR_BLOCKS,
  formatAmount,
  monthLabel,
  monthToYearMonth,
  quarterDelta,
} from '@/components/reports/year-report.helpers';
import { UrlConstants } from '@/constants/url-constants';
import type { YearReportType0 } from '@/types/reports/year-report.types';

type Props = {
  data: YearReportType0;
  companyId: number;
};

export function YearReportType0Table({ data, companyId }: Props): ReactNode {
  const { t, i18n } = useTranslation(['reports']);
  const prevDeltas: Record<string, number | null> = {
    first: null,
    second: data.quarters.first.delta,
    third: data.quarters.second.delta,
    fourth: data.quarters.third.delta,
  };

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
              <Table.Th>{t('reports:commission')}</Table.Th>
              <Table.Th>{t('reports:purchase')}</Table.Th>
              <Table.Th>{t('reports:transportCosts')}</Table.Th>
              <Table.Th>{t('reports:operatingOutgoings')}</Table.Th>
              <Table.Th>Debt</Table.Th>
              <Table.Th>Credit of Supplier</Table.Th>
              <Table.Th>Commission credit</Table.Th>
              <Table.Th>Saldo</Table.Th>
              <Table.Th>{t('reports:delta')}</Table.Th>
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
                <Table.Td>{formatAmount(item.commissionPay)}</Table.Td>
                <Table.Td>{formatAmount(item.inPay)}</Table.Td>
                <Table.Td>{formatAmount(item.outTransport)}</Table.Td>
                <Table.Td>{formatAmount(item.operatingOutgoings)}</Table.Td>
                <Table.Td>{formatAmount(item.debt)}</Table.Td>
                <Table.Td>{formatAmount(item.suplCredit)}</Table.Td>
                <Table.Td>{formatAmount(item.commissionLeft)}</Table.Td>
                <Table.Td>{formatAmount(item.saldo)}</Table.Td>
                <Table.Td>{formatAmount(item.delta)}</Table.Td>
                <Table.Td>{formatAmount(item.profit)}</Table.Td>
              </Table.Tr>
            ))}
            <Table.Tr>
              <Table.Th>{t(`reports:${block.ytdLabelKey}`)}</Table.Th>
              <Table.Td>{formatAmount(quarter.total)}</Table.Td>
              <Table.Td>{formatAmount(quarter.commission)}</Table.Td>
              <Table.Td>{formatAmount(quarter.inSum)}</Table.Td>
              <Table.Td>{formatAmount(quarter.inTransport)}</Table.Td>
              <Table.Td>{formatAmount(quarter.operatingOutgoings)}</Table.Td>
              <Table.Td>{formatAmount(quarter.debt)}</Table.Td>
              <Table.Td>{formatAmount(quarter.suplCredit)}</Table.Td>
              <Table.Td>{formatAmount(quarter.comCredit)}</Table.Td>
              <Table.Td>
                {formatAmount(
                  quarter.debt - quarter.suplCredit - quarter.comCredit,
                )}
              </Table.Td>
              <Table.Td>{formatAmount(quarter.delta)}</Table.Td>
              <Table.Td>{formatAmount(quarter.profit)}</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td colSpan={9} />
              <Table.Td>{t('reports:forQuarter')}</Table.Td>
              <Table.Td>
                {formatAmount(
                  quarterDelta(quarter.delta, prevDeltas[block.key]),
                )}
              </Table.Td>
              <Table.Td />
            </Table.Tr>
            <Table.Tr>
              <Table.Td colSpan={12} h={40} />
            </Table.Tr>
          </Table.Tbody>
        );
      })}
    </Table>
  );
}
