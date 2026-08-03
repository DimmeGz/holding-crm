import { type ReactNode, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Group, NumberInput, Stack, Text } from '@mantine/core';
import { getErrorMessage } from '@/api/api-client';
import { showError, showSuccess } from '@/helpers/notifications.helpers';
import { ReportsService } from '@/services/reports/reports.service';
import type { MonthDataBlock } from '@/types/reports/month-report.types';

type Props = {
  companyId: number;
  date: string;
  reportType: number;
  process: number | null;
  monthData: MonthDataBlock;
  onSaved: () => void;
};

export function MonthDataSaveForm({
  companyId,
  date,
  reportType,
  process,
  monthData,
  onSaved,
}: Props): ReactNode {
  const { t } = useTranslation(['reports', 'common']);
  const [operatingOutgoings, setOperatingOutgoings] = useState(0);
  const [factVatReturn, setFactVatReturn] = useState<number | ''>('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setOperatingOutgoings(monthData.saved?.operatingOutgoings ?? 0);
    setFactVatReturn(
      monthData.saved?.factVatReturn === null ||
        monthData.saved?.factVatReturn === undefined
        ? ''
        : monthData.saved.factVatReturn,
    );
  }, [monthData.saved]);

  const handleSave = async (): Promise<void> => {
    setSaving(true);
    try {
      await ReportsService.saveMonthData(companyId, {
        month: date,
        operatingOutgoings,
        ...(process && reportType !== 2 ? { process } : {}),
        ...(reportType === 3
          ? {
              factVatReturn:
                factVatReturn === '' ? null : Number(factVatReturn),
            }
          : {}),
      });
      showSuccess(t('common:messages.saveSuccess'));
      onSaved();
    } catch (error) {
      showError(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Stack mt='md' maw={420}>
      <NumberInput
        label={t('reports:operatingOutgoings')}
        value={operatingOutgoings}
        onChange={(value) =>
          setOperatingOutgoings(typeof value === 'number' ? value : 0)
        }
        decimalScale={3}
        fixedDecimalScale={false}
      />
      {reportType === 3 && (
        <>
          <NumberInput
            label={t('reports:factVatReturn')}
            value={factVatReturn}
            onChange={(value) =>
              setFactVatReturn(typeof value === 'number' ? value : '')
            }
            decimalScale={3}
            fixedDecimalScale={false}
          />
          {monthData.countVatReturn !== null && (
            <Text size='sm' c='dimmed'>
              {t('reports:countVatReturn')}: {monthData.countVatReturn}
            </Text>
          )}
        </>
      )}
      <Group>
        <Button loading={saving} onClick={() => void handleSave()}>
          {t('reports:saveData')}
        </Button>
      </Group>
    </Stack>
  );
}
