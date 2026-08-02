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
import { EMPTY_INVOICE_PRODUCT_LINE } from '@/constants/document-lines.constants';
import { recordToSelectData } from '@/helpers/select.helpers';
import { useLibsStore } from '@/stores/useLibsStore';
import type { InvoiceProductLineFormValue } from '@/types/documents/invoices.types';

export function InvoiceProductLineEditor({
  lines,
  onChange,
  currencyLabel = '',
  showOrderColumn = true,
  orderOptions = [],
  orderReadOnly = false,
}: {
  lines: InvoiceProductLineFormValue[];
  onChange: (lines: InvoiceProductLineFormValue[]) => void;
  currencyLabel?: string;
  showOrderColumn?: boolean;
  orderOptions?: { value: string; label: string }[];
  orderReadOnly?: boolean;
}): ReactNode {
  const { t } = useTranslation(['documents', 'tables', 'common']);
  const products = useLibsStore(s => s.products);
  const packages = useLibsStore(s => s.packages);
  const countries = useLibsStore(s => s.countries);
  const batches = useLibsStore(s => s.batches);

  const productOptions = useMemo(() => recordToSelectData(products), [products]);
  const packageOptions = useMemo(() => recordToSelectData(packages), [packages]);
  const countryOptions = useMemo(() => recordToSelectData(countries), [countries]);

  const getBatchOptions = (productId: string | null) => {
    if (!productId) {
      return [];
    }

    const productIdNum = Number(productId);
    return Object.entries(batches)
      .filter(([, batch]) => batch.productId === productIdNum)
      .map(([id, batch]) => ({ value: id, label: batch.name }));
  };

  const updateLine = (
    index: number,
    patch: Partial<InvoiceProductLineFormValue>,
  ): void => {
    onChange(lines.map((line, i) => (i === index ? { ...line, ...patch } : line)));
  };

  const addLine = (): void => {
    onChange([...lines, { ...EMPTY_INVOICE_PRODUCT_LINE }]);
  };

  const removeLine = (index: number): void => {
    onChange(lines.filter((_, i) => i !== index));
  };

  return (
    <>
      <Group justify='space-between' mb='xs'>
        <Text fw={600}>{t('documents:documents.productLines')}</Text>
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
            {showOrderColumn && (
              <Table.Th>{t('documents:documents.order')}</Table.Th>
            )}
            <Table.Th>{t('tables:columns.product')}</Table.Th>
            <Table.Th>{t('tables:columns.batch')}</Table.Th>
            <Table.Th>{t('tables:columns.package')}</Table.Th>
            <Table.Th>{t('tables:columns.palletsQty')}</Table.Th>
            <Table.Th>{t('tables:columns.qty')}</Table.Th>
            <Table.Th>
              {t('tables:columns.price')} {currencyLabel}
            </Table.Th>
            <Table.Th>
              {t('tables:columns.cost')} {currencyLabel}
            </Table.Th>
            <Table.Th>{t('tables:columns.countryOfOrigin')}</Table.Th>
            <Table.Th>{t('documents:documents.grossWeight')}</Table.Th>
            <Table.Th w={40} />
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {lines.map((line, index) => (
            <Table.Tr key={line.id ?? `new-${index}`}>
              {showOrderColumn && (
                <Table.Td>
                  <Select
                    data={orderOptions}
                    value={line.orderId}
                    onChange={value => updateLine(index, { orderId: value })}
                    searchable
                    disabled={orderReadOnly}
                    nothingFoundMessage={t('common:messages.noData')}
                    size='xs'
                  />
                </Table.Td>
              )}
              <Table.Td>
                <Select
                  data={productOptions}
                  value={line.productId}
                  onChange={value =>
                    updateLine(index, { productId: value, batchId: null })
                  }
                  searchable
                  nothingFoundMessage={t('common:messages.noData')}
                  size='xs'
                />
              </Table.Td>
              <Table.Td>
                <Select
                  data={getBatchOptions(line.productId)}
                  value={line.batchId}
                  onChange={value => updateLine(index, { batchId: value })}
                  searchable
                  disabled={!line.productId}
                  nothingFoundMessage={t('common:messages.noData')}
                  size='xs'
                />
              </Table.Td>
              <Table.Td>
                <Select
                  data={packageOptions}
                  value={line.packageId}
                  onChange={value => updateLine(index, { packageId: value })}
                  searchable
                  nothingFoundMessage={t('common:messages.noData')}
                  size='xs'
                />
              </Table.Td>
              <Table.Td>
                <NumberInput
                  value={line.palletsQty}
                  onChange={value =>
                    updateLine(index, { palletsQty: Number(value) || 0 })
                  }
                  min={1}
                  size='xs'
                  hideControls
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
                <NumberInput
                  value={line.cost ?? undefined}
                  onChange={value =>
                    updateLine(index, {
                      cost: value === '' || value == null ? null : Number(value),
                    })
                  }
                  min={0}
                  decimalScale={3}
                  fixedDecimalScale
                  size='xs'
                  hideControls
                />
              </Table.Td>
              <Table.Td>
                <Select
                  data={countryOptions}
                  value={line.countryOfOriginId}
                  onChange={value =>
                    updateLine(index, { countryOfOriginId: value })
                  }
                  searchable
                  clearable
                  nothingFoundMessage={t('common:messages.noData')}
                  size='xs'
                />
              </Table.Td>
              <Table.Td>
                <NumberInput
                  value={line.grossWeight ?? undefined}
                  onChange={value =>
                    updateLine(index, {
                      grossWeight:
                        value === '' || value == null ? null : Number(value),
                    })
                  }
                  min={0}
                  decimalScale={2}
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
