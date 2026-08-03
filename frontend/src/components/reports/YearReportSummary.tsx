import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Group, Table, Text } from '@mantine/core';
import { getErrorMessage } from '@/api/api-client';
import { formatAmount } from '@/components/reports/year-report.helpers';
import { showError, showSuccess } from '@/helpers/notifications.helpers';
import { useMutation } from '@/hooks/useMutation';
import { ReportsService } from '@/services/reports/reports.service';
import type {
  YearReportType0,
  YearReportType1,
  YearReportType3,
} from '@/types/reports/year-report.types';

type SupportedYearReport =
  | YearReportType0
  | YearReportType1
  | YearReportType3;

type Props = {
  data: SupportedYearReport;
  companyId: number;
  onSaved: () => void;
};

export function YearReportSummary({
  data,
  companyId,
  onSaved,
}: Props): ReactNode {
  const { t } = useTranslation(['reports', 'common']);
  const { loading, mutateAsync } = useMutation(
    (payload: { year: number; amount: number }) =>
      ReportsService.saveCashflow(companyId, payload),
  );

  const showWarehouse =
    data.reportType === 1 || data.reportType === 3;
  const prevYearLabel = String(data.year - 1).slice(-2);

  const handleSave = async (): Promise<void> => {
    try {
      await mutateAsync({ year: data.year, amount: data.cashflow });
      showSuccess(t('common:messages.saveSuccess'));
      onSaved();
    } catch (error) {
      showError(getErrorMessage(error));
    }
  };

  return (
    <Table withTableBorder withColumnBorders maw={520} mt='lg'>
      <Table.Tbody>
        <Table.Tr>
          <Table.Th colSpan={2}>
            <Text fw={600}>{new Date().toLocaleDateString('uk-UA')}</Text>
          </Table.Th>
        </Table.Tr>
        <Table.Tr>
          <Table.Th>
            {t('reports:cashflowPrevious', { year: prevYearLabel })}
          </Table.Th>
          <Table.Td>{formatAmount(data.cashflowPrevious)}</Table.Td>
        </Table.Tr>
        <Table.Tr>
          <Table.Th>{t('reports:salesYtd')}</Table.Th>
          <Table.Td>{formatAmount(data.total.sales)}</Table.Td>
        </Table.Tr>
        <Table.Tr>
          <Table.Th>{t('reports:buyYtd')}</Table.Th>
          <Table.Td>{formatAmount(data.total.buy)}</Table.Td>
        </Table.Tr>
        {showWarehouse && (
          <Table.Tr>
            <Table.Th>{t('reports:warehouse')}</Table.Th>
            <Table.Td>
              {formatAmount(
                data.reportType === 1 || data.reportType === 3
                  ? data.totalWareAmount
                  : 0,
              )}
            </Table.Td>
          </Table.Tr>
        )}
        {data.reportType === 0 && (
          <Table.Tr>
            <Table.Th>{t('reports:yearDelta')}</Table.Th>
            <Table.Td>{formatAmount(data.yearDelta)}</Table.Td>
          </Table.Tr>
        )}
        <Table.Tr>
          <Table.Th>{t('reports:capitalization')}</Table.Th>
          <Table.Td>{formatAmount(data.capitalization)}</Table.Td>
        </Table.Tr>
        {(data.reportType === 1 || data.reportType === 3) && (
          <Table.Tr>
            <Table.Th>{t('reports:yearDelta')}</Table.Th>
            <Table.Td>{formatAmount(data.yearDelta)}</Table.Td>
          </Table.Tr>
        )}
        <Table.Tr>
          <Table.Th>{t('reports:cashflow')}</Table.Th>
          <Table.Td>{formatAmount(data.cashflow)}</Table.Td>
        </Table.Tr>
        <Table.Tr>
          <Table.Th>{t('reports:savedData')}</Table.Th>
          <Table.Td>
            <Group justify='space-between' wrap='nowrap'>
              <Text>
                {data.savedCashflow ? formatAmount(data.savedCashflow) : ''}
              </Text>
              <Button size='xs' loading={loading} onClick={() => void handleSave()}>
                {t('common:actions.save')}
              </Button>
            </Group>
          </Table.Td>
        </Table.Tr>
      </Table.Tbody>
    </Table>
  );
}
