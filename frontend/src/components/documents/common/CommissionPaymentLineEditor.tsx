import { type ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActionIcon,
  Button,
  Group,
  NumberInput,
  Select,
  Table,
  Text,
} from '@mantine/core';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import type { CommissionPaymentLineFormValue } from '@/types/documents/commission-payments.types';

export function CommissionPaymentLineEditor({
  lines,
  onChange,
  commissionInvoiceOptions,
  currencyLabel = '',
}: {
  lines: CommissionPaymentLineFormValue[];
  onChange: (lines: CommissionPaymentLineFormValue[]) => void;
  commissionInvoiceOptions: { value: string; label: string }[];
  currencyLabel?: string;
}): ReactNode {
  const { t } = useTranslation(['documents', 'tables', 'common']);
  const options = useMemo(
    () => commissionInvoiceOptions,
    [commissionInvoiceOptions],
  );

  const updateLine = (
    index: number,
    patch: Partial<CommissionPaymentLineFormValue>,
  ): void => {
    onChange(lines.map((line, i) => (i === index ? { ...line, ...patch } : line)));
  };

  const addLine = (): void => {
    onChange([...lines, { commissionInvoiceId: null, amount: 0 }]);
  };

  const removeLine = (index: number): void => {
    if (lines.length <= 1) {
      return;
    }
    onChange(lines.filter((_, i) => i !== index));
  };

  return (
    <>
      <Group justify='space-between' mb='xs'>
        <Text fw={600}>{t('documents:documents.byCommissionInvoice')}</Text>
        <Button
          variant='light'
          size='xs'
          leftSection={<IconPlus size={14} />}
          onClick={addLine}
          type='button'
        >
          {t('common:actions.create')}
        </Button>
      </Group>

      <Table striped highlightOnHover withTableBorder mb='md'>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>{t('documents:documents.commissionInvoice')}</Table.Th>
            <Table.Th>
              {t('tables:columns.amount')} {currencyLabel}
            </Table.Th>
            <Table.Th w={40} />
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {lines.map((line, index) => (
            <Table.Tr key={line.id ?? `new-${index}`}>
              <Table.Td>
                <Select
                  data={options}
                  value={line.commissionInvoiceId}
                  onChange={value =>
                    updateLine(index, { commissionInvoiceId: value })
                  }
                  searchable
                  nothingFoundMessage={t('common:messages.noData')}
                  size='xs'
                />
              </Table.Td>
              <Table.Td>
                <NumberInput
                  value={line.amount}
                  onChange={value =>
                    updateLine(index, { amount: Number(value) || 0 })
                  }
                  min={0}
                  decimalScale={3}
                  size='xs'
                />
              </Table.Td>
              <Table.Td>
                <ActionIcon
                  variant='subtle'
                  color='red'
                  onClick={() => removeLine(index)}
                  disabled={lines.length <= 1}
                  type='button'
                >
                  <IconTrash size={16} />
                </ActionIcon>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </>
  );
}
