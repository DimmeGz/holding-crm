import { type ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ActionIcon, Button, Group, NumberInput, Select, Table, Text } from '@mantine/core';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import { EMPTY_SERVICE_LINE } from '@/constants/document-lines.constants';
import { recordToSelectData } from '@/helpers/select.helpers';
import { useLibsStore } from '@/stores/useLibsStore';
import type { ServiceLineFormValue } from '@/types/documents/contracts.types';

export function DocumentServiceLineEditor({
  lines,
  onChange,
  currencyLabel = '',
}: {
  lines: ServiceLineFormValue[];
  onChange: (lines: ServiceLineFormValue[]) => void;
  currencyLabel?: string;
}): ReactNode {
  const { t } = useTranslation(['documents', 'tables', 'common']);
  const services = useLibsStore(s => s.services);
  const serviceOptions = useMemo(() => recordToSelectData(services), [services]);

  const updateLine = (index: number, patch: Partial<ServiceLineFormValue>): void => {
    onChange(lines.map((line, i) => (i === index ? { ...line, ...patch } : line)));
  };

  const addLine = (): void => {
    onChange([...lines, { ...EMPTY_SERVICE_LINE }]);
  };

  const removeLine = (index: number): void => {
    onChange(lines.filter((_, i) => i !== index));
  };

  return (
    <>
      <Group justify='space-between' mb='xs'>
        <Text fw={600}>{t('documents:documents.serviceLines')}</Text>
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
            <Table.Th>{t('tables:columns.name')}</Table.Th>
            <Table.Th>{t('tables:columns.qty')}</Table.Th>
            <Table.Th>
              {t('tables:columns.price')} {currencyLabel}
            </Table.Th>
            <Table.Th w={40} />
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {lines.map((line, index) => (
            <Table.Tr key={line.id ?? `new-${index}`}>
              <Table.Td>
                <Select
                  data={serviceOptions}
                  value={line.serviceId}
                  onChange={value => updateLine(index, { serviceId: value })}
                  searchable
                  nothingFoundMessage={t('common:messages.noData')}
                  size='xs'
                />
              </Table.Td>
              <Table.Td>
                <NumberInput
                  value={line.qty}
                  onChange={value =>
                    updateLine(index, { qty: Number(value) || 0 })
                  }
                  min={1}
                  size='xs'
                  hideControls
                />
              </Table.Td>
              <Table.Td>
                <NumberInput
                  value={line.price}
                  onChange={value =>
                    updateLine(index, { price: Number(value) || 0 })
                  }
                  min={0}
                  decimalScale={3}
                  fixedDecimalScale
                  size='xs'
                  hideControls
                />
              </Table.Td>
              <Table.Td>
                <ActionIcon
                  color='red'
                  variant='subtle'
                  onClick={() => removeLine(index)}
                  type='button'
                  aria-label={t('common:actions.delete')}
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
