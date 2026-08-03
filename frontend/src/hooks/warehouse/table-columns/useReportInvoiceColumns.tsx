import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Stack, Text } from '@mantine/core';
import type { MRT_ColumnDef, MRT_Row } from 'mantine-react-table';
import { CommonConstants } from '@/constants/common.constants';
import { UrlConstants } from '@/constants/url-constants';
import { useLibsStore } from '@/stores/useLibsStore';
import type { ReportInvoiceLine } from '@/types/warehouse/warehouse.types';

function formatDate(value?: Date | string | null): string {
  return value
    ? new Date(value).toLocaleDateString('uk-UA')
    : CommonConstants.EMPTY_STRING;
}

export function useReportInvoiceColumns(options?: {
  linkProduct?: boolean;
  linkBatch?: boolean;
}): MRT_ColumnDef<ReportInvoiceLine>[] {
  const { t } = useTranslation(['tables', 'documents', 'common']);
  const getCurrencyName = useLibsStore((s) => s.getCurrencyName);
  const linkProduct = options?.linkProduct ?? false;
  const linkBatch = options?.linkBatch ?? true;

  return useMemo(
    () => [
      {
        header: CommonConstants.NUMBER,
        id: 'rowNumber',
        size: 50,
        Cell: ({ row }: { row: MRT_Row<ReportInvoiceLine> }) => row.index + 1,
      },
      {
        header: t('documents:documents.invoice'),
        id: 'invoice',
        size: 140,
        Cell: ({ row }: { row: MRT_Row<ReportInvoiceLine> }) => {
          const invoice = row.original.invoice;
          if (!invoice?.id) {
            return CommonConstants.EMPTY_STRING;
          }

          return (
            <Stack gap={4}>
              <Text
                component={Link}
                to={`${UrlConstants.INVOICES_URL}/${invoice.id}`}
                td='underline'
              >
                {invoice.invoiceNumber || invoice.id}
              </Text>
              {(invoice.shipments ?? []).map((shipment) => (
                <Text key={shipment.id} size='sm'>
                  <Text
                    component={Link}
                    to={`${UrlConstants.SHIPMENTS_URL}/${shipment.id}`}
                    td='underline'
                    inherit
                  >
                    {t('documents:documents.shipment')} {CommonConstants.NUMBER}
                    {shipment.id} {shipment.status ? '(+)' : '(-)'}
                  </Text>
                  {(shipment.receives ?? []).map((receive) => (
                    <Text
                      key={receive.id}
                      component={Link}
                      to={`${UrlConstants.RECEIVES_URL}/${receive.id}`}
                      td='underline'
                      ml='sm'
                      inherit
                    >
                      {t('documents:documents.receive')} {CommonConstants.NUMBER}
                      {receive.id} {receive.status ? '(+)' : '(-)'}
                    </Text>
                  ))}
                </Text>
              ))}
            </Stack>
          );
        },
      },
      {
        header: t('tables:columns.product'),
        id: 'product',
        size: 140,
        accessorFn: (row: ReportInvoiceLine): string =>
          row.product?.name ?? CommonConstants.EMPTY_STRING,
        Cell: ({ row }: { row: MRT_Row<ReportInvoiceLine> }) => {
          const product = row.original.product;
          if (!product?.id) {
            return CommonConstants.EMPTY_STRING;
          }

          if (!linkProduct) {
            return product.name;
          }

          return (
            <Text
              component={Link}
              to={`${UrlConstants.PRODUCT_REPORT_URL}/${product.id}`}
              td='underline'
            >
              {product.name}
            </Text>
          );
        },
      },
      {
        header: t('tables:columns.batch'),
        id: 'batch',
        size: 120,
        accessorFn: (row: ReportInvoiceLine): string =>
          row.batch?.name ?? CommonConstants.EMPTY_STRING,
        Cell: ({ row }: { row: MRT_Row<ReportInvoiceLine> }) => {
          const batch = row.original.batch;
          if (!batch?.id) {
            return CommonConstants.EMPTY_STRING;
          }

          if (!linkBatch) {
            return batch.name;
          }

          return (
            <Text
              component={Link}
              to={`${UrlConstants.BATCH_REPORT_URL}/${batch.id}`}
              td='underline'
            >
              {batch.name}
            </Text>
          );
        },
      },
      {
        header: t('tables:columns.qty'),
        id: 'qty',
        size: 90,
        accessorFn: (row: ReportInvoiceLine): number => row.qty,
      },
      {
        header: t('tables:columns.price'),
        id: 'price',
        size: 100,
        accessorFn: (row: ReportInvoiceLine): number => row.price,
      },
      {
        header: t('tables:columns.amount'),
        id: 'amount',
        size: 120,
        accessorFn: (row: ReportInvoiceLine): string => {
          const total = row.price * row.qty;
          const currency = getCurrencyName(row.invoice.currencyId);
          return `${total} ${currency}`.trim();
        },
      },
      {
        header: t('tables:columns.seller'),
        id: 'seller',
        size: 140,
        accessorFn: (row: ReportInvoiceLine): string =>
          row.invoice?.seller?.name ?? CommonConstants.EMPTY_STRING,
      },
      {
        header: t('tables:columns.buyer'),
        id: 'buyer',
        size: 140,
        accessorFn: (row: ReportInvoiceLine): string =>
          row.invoice?.buyer?.name ?? CommonConstants.EMPTY_STRING,
      },
      {
        header: t('tables:columns.expectedDate'),
        id: 'expectedDate',
        size: 110,
        accessorFn: (row: ReportInvoiceLine): string =>
          formatDate(row.invoice?.expectedDate),
      },
    ],
    [getCurrencyName, linkBatch, linkProduct, t],
  );
}
