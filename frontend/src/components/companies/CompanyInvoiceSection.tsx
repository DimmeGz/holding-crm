import { Fragment, type ReactNode, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import {
  Button,
  Checkbox,
  Group,
  Table,
  Text,
  Title,
} from '@mantine/core';
import { CommonConstants } from '@/constants/common.constants';
import { UrlConstants } from '@/constants/url-constants';
import {
  getInvoiceDueDate,
  groupInvoicesByCounterparty,
  isInvoiceOverdue,
  validatePaymentInvoiceSelection,
} from '@/helpers/companies.helpers';
import { showError } from '@/helpers/notifications.helpers';
import type { CompanyInvoiceRef } from '@/types/companies/companies.types';

type CompanyInvoiceSectionProps = {
  title: string;
  side: 'waiting' | 'debt';
  invoices: CompanyInvoiceRef[];
};

function formatDate(value: string | undefined): string {
  if (!value) {
    return CommonConstants.EMPTY_STRING;
  }

  return new Date(value).toLocaleDateString('uk-UA');
}

export function CompanyInvoiceSection({
  title,
  side,
  invoices,
}: CompanyInvoiceSectionProps): ReactNode {
  const { t } = useTranslation(['companies']);
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const groups = useMemo(
    () => groupInvoicesByCounterparty(invoices, side),
    [invoices, side],
  );

  if (groups.length === 0) {
    return null;
  }

  const toggleInvoice = (invoiceId: number, checked: boolean): void => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(invoiceId);
      } else {
        next.delete(invoiceId);
      }
      return next;
    });
  };

  const handleCreatePayment = (): void => {
    const selected = invoices.filter((invoice) => selectedIds.has(invoice.id));

    if (selected.length === 0) {
      showError(t('companies:noSelectionError'));
      return;
    }

    if (!validatePaymentInvoiceSelection(selected)) {
      showError(t('companies:mixedSelectionError'));
      return;
    }

    const invoiceIds = selected.map((invoice) => invoice.id).join(',');
    navigate(`${UrlConstants.PAYMENTS_URL}/new?invoiceIds=${invoiceIds}`);
  };

  return (
    <>
      <Group justify='space-between' mt='lg' mb='xs'>
        <Title order={4}>{title}</Title>
        <Button variant='light' size='xs' onClick={handleCreatePayment}>
          {t('companies:createPayment')}
        </Button>
      </Group>

      <Table withTableBorder withColumnBorders highlightOnHover mb='md'>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>{t('companies:company')}</Table.Th>
            <Table.Th>{t('companies:selectForPayment')}</Table.Th>
            <Table.Th>{t('companies:invoice')}</Table.Th>
            <Table.Th>{t('companies:expectedDate')}</Table.Th>
            <Table.Th>{t('companies:amount')}</Table.Th>
            <Table.Th>{t('companies:dueDate')}</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {groups.map((group) => (
            <Fragment key={group.counterpartyId}>
              {group.invoices.map((invoice, index) => {
                const overdue = isInvoiceOverdue(invoice);

                return (
                  <Table.Tr
                    key={invoice.id}
                    bg={overdue ? 'var(--mantine-color-red-1)' : undefined}
                    title={overdue ? t('companies:overdue') : undefined}
                  >
                    {index === 0 && (
                      <Table.Td rowSpan={group.invoices.length + 1}>
                        <Text fw={600}>{group.counterpartyName}</Text>
                      </Table.Td>
                    )}
                    <Table.Td>
                      <Checkbox
                        checked={selectedIds.has(invoice.id)}
                        onChange={(event) =>
                          toggleInvoice(invoice.id, event.currentTarget.checked)
                        }
                        aria-label={t('companies:selectForPayment')}
                      />
                    </Table.Td>
                    <Table.Td>
                      <Text
                        component={Link}
                        to={`${UrlConstants.INVOICES_URL}/${invoice.id}`}
                        td='underline'
                      >
                        {invoice.invoiceNumber}
                      </Text>
                    </Table.Td>
                    <Table.Td>{formatDate(invoice.expectedDate)}</Table.Td>
                    <Table.Td>{invoice.paymentBalance}</Table.Td>
                    <Table.Td>
                      {getInvoiceDueDate(invoice).format('DD.MM.YYYY')}
                    </Table.Td>
                  </Table.Tr>
                );
              })}
              <Table.Tr bg='var(--mantine-color-gray-1)'>
                <Table.Td colSpan={2}>{t('companies:subtotal')}</Table.Td>
                <Table.Td />
                <Table.Td>{group.total}</Table.Td>
                <Table.Td />
              </Table.Tr>
            </Fragment>
          ))}
        </Table.Tbody>
      </Table>
    </>
  );
}
