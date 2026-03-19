import { type ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Card, Grid, Group, Text } from '@mantine/core';
import type { MRT_ColumnDef, MRT_TableOptions } from 'mantine-react-table';
import { IconCircle, IconCircleFilled } from '@tabler/icons-react';
import { DocumentPageItem } from '@/components/documents/common/DocumentPageItem';
import { HoldingTable } from '@/components/shared/HoldingTable';
import { Spinner } from '@/components/shared/Spinner';
import { CommonConstants } from '@/constants/common.constants';
import { StylesConstants } from '@/constants/styles.constants';
import { useInvoiceLinesColumns } from '@/hooks/documents/table-columns/useInvoiceLinesColumns';
import { useInvoiceServiceLinesColumns } from '@/hooks/documents/table-columns/useInvoiceServiceLinesColumns';
import { useInvoice } from '@/hooks/documents/useInvoices';
import { useLibsStore } from '@/stores/useLibsStore';
import type { Invoice, InvoiceLine, InvoiceServiceLine } from '@/types/documents/invoices.types';

export function InvoicePage(): ReactNode {
  const { t } = useTranslation(['common', 'documents']),
    { id } = useParams<{ id: string }>(),
    { data, loading, error } = useInvoice(Number(id)),
    getCompanyName: (id: number) => string = useLibsStore(
      s => s.getCompanyName,
    ),
    getWarehouseName: (id: number) => string = useLibsStore(
      s => s.getWarehouseName,
    ),
    getCurrencyName: (id: number) => string = useLibsStore(
      s => s.getCurrencyName,
    ),
    invoice: Invoice | undefined = data?.invoice,
    columns: MRT_ColumnDef<InvoiceLine>[] = useInvoiceLinesColumns(
      invoice
        ? getCurrencyName(invoice.currencyId)
        : CommonConstants.EMPTY_STRING,
    ),
    serviceColumns: MRT_ColumnDef<InvoiceServiceLine>[] = useInvoiceServiceLinesColumns(
      invoice
        ? getCurrencyName(invoice.currencyId)
        : CommonConstants.EMPTY_STRING,
    ),
    invoiceLinesTableConfig: MRT_TableOptions<InvoiceLine> = useMemo(
      () => ({
        data: invoice?.invoiceLines || [],
        columns,
        enablePagination: false,
        enableSorting: false,
        enableColumnFilters: false,
        enableBottomToolbar: false,
        enableColumnActions: false,
        enableGlobalFilter: false,
        enableFullScreenToggle: false,
        enableHiding: false,
        mantinePaperProps: {
          shadow: 'sm',
          radius: 'md',
        },
      }),
      [invoice, columns],
    ),
    invoiceServiceLinesTableConfig: MRT_TableOptions<InvoiceServiceLine> =
      useMemo(
        () => ({
          data: invoice?.invoiceServiceLines || [],
          columns: serviceColumns,
          enablePagination: false,
          enableSorting: false,
          enableColumnFilters: false,
          enableBottomToolbar: false,
          enableColumnActions: false,
          enableGlobalFilter: false,
          enableFullScreenToggle: false,
          enableHiding: false,
          mantinePaperProps: {
            shadow: 'sm',
            radius: 'md',
            mt: 'sm'
          },
        }),
        [invoice, serviceColumns],
      );

  return (
    <>
      {loading && <Spinner />}

      {!loading && error && (
        <h3>
          {t('common:messages.error')} {error}
        </h3>
      )}

      {!loading && !error && invoice && (
        <>
          <Card shadow='sm' p='md' radius='md' withBorder mb='xs' mt='6'>
            <Grid gutter='xs' align='flex-start'>
              <Grid.Col span={12}>
                <Group justify='flex-start' wrap='nowrap' gap='2'>
                  {invoice.status ? (
                    <IconCircleFilled color='green' />
                  ) : (
                    <IconCircle color='grey' stroke={5} />
                  )}
                  <Text
                    size='lg'
                    fw={StylesConstants.HEAVY_FONT_WEIGHT}
                    ml='xs'
                  >
                    {t('documents:documents.invoice')} {invoice.invoiceNumber}
                  </Text>
                </Group>
              </Grid.Col>

              <Grid.Col span={4}>
                <Text size='sm' fw={StylesConstants.DEFAULT_FONT_WEIGHT}>
                  {t('documents:documents.createdAt')}:{' '}
                  {new Date(invoice.expectedDate).toLocaleDateString('uk-UA')}
                </Text>
              </Grid.Col>
              {invoice.parent && (
                <Grid.Col span={4}>
                  <Text size='sm' fw={StylesConstants.DEFAULT_FONT_WEIGHT}>
                    {t('documents:documents.byInvoice')}:{' '}
                    {invoice.parent?.invoiceNumber}
                  </Text>
                </Grid.Col>
              )}
            </Grid>
          </Card>

          <Card shadow='sm' p='md' radius='md' withBorder mb='sm'>
            <Text fw={StylesConstants.HEAVY_FONT_WEIGHT} size='md' mb='5'>
              {t('documents:documents.mainInfo')}
            </Text>
            <Grid gutter='md' align='flex-start'>
              <DocumentPageItem
                gridSpan={invoice.recipientId ? 4 : 6}
                translationKey={{
                  primary: 'documents:documents.seller',
                  secondary: 'documents:documents.warehouse',
                }}
                baseValue={{
                  primary: getCompanyName(invoice.sellerId),
                  secondary: getWarehouseName(invoice.sellerWarehouseId),
                }}
              />
              <DocumentPageItem
                gridSpan={invoice.recipientId ? 4 : 6}
                translationKey={{
                  primary: 'documents:documents.buyer',
                  secondary: 'documents:documents.warehouse',
                }}
                baseValue={{
                  primary: getCompanyName(invoice.buyerId),
                  secondary: getWarehouseName(invoice.buyerWarehouseId),
                }}
              />

              {invoice.recipientId && invoice.recipientWarehouseId && (
                <DocumentPageItem
                  gridSpan={4}
                  translationKey={{
                    primary: 'documents:documents.recipient',
                    secondary: 'documents:documents.warehouse',
                  }}
                  baseValue={{
                    primary: getCompanyName(invoice.recipientId),
                    secondary: getWarehouseName(invoice.recipientWarehouseId),
                  }}
                />
              )}
            </Grid>
          </Card>

          <Card shadow='sm' p='md' radius='md' withBorder mb='sm'>
            <Text fw={StylesConstants.HEAVY_FONT_WEIGHT} size='md' mb='5'>
              {t('documents:documents.payDelivery')}
            </Text>
            <Grid gutter='md' align='flex-start'>
              <DocumentPageItem
                gridSpan={3}
                translationKey={{
                  primary: 'documents:documents.vat',
                }}
                baseValue={{
                  primary: `${invoice.vat} %`,
                }}
              />
              <DocumentPageItem
                gridSpan={3}
                translationKey={{
                  primary: 'documents:documents.paymentBalance',
                }}
                baseValue={{
                  primary: `${invoice.paymentBalance} ${getCurrencyName(invoice.currencyId)}`,
                }}
              />
              <DocumentPageItem
                gridSpan={3}
                translationKey={{
                  primary: 'documents:documents.paymentDelay',
                }}
                baseValue={{
                  primary: `${invoice.paymentDelay} ${t('common:common.days')}`,
                }}
              />
              <DocumentPageItem
                gridSpan={3}
                translationKey={{
                  primary: 'documents:documents.incoterms',
                }}
                baseValue={{
                  primary: invoice.incoterms
                    ? [invoice.incoterms.name, invoice.transportPlace].join(
                      CommonConstants.COMA_SPACE,
                    )
                    : CommonConstants.EMPTY_STRING,
                }}
              />
              <DocumentPageItem
                gridSpan={3}
                translationKey={{
                  primary: 'PONZ',
                }}
                baseValue={{
                  primary: invoice.ponz.toLocaleString(),
                }}
              />
              <DocumentPageItem
                gridSpan={3}
                translationKey={{
                  primary: 'documents:documents.grossWeight',
                }}
                baseValue={{
                  primary: `${invoice.grossWeight} ${t('common:common.kg')}`,
                }}
              />
              <DocumentPageItem
                gridSpan={3}
                translationKey={{
                  primary: 'documents:documents.transportAmount',
                }}
                baseValue={{
                  primary: `${invoice.transportAmount} ${getCurrencyName(invoice.currencyId)}`,
                }}
              />
              <DocumentPageItem
                gridSpan={3}
                translationKey={{
                  primary: 'documents:documents.ordersSeparation',
                }}
                baseValue={{
                  primary: invoice.separation
                    ? CommonConstants.CHECK_MARK
                    : CommonConstants.X_MARK,
                }}
              />
              <DocumentPageItem
                gridSpan={3}
                translationKey={{
                  primary: 'documents:documents.reportPeriod',
                }}
                baseValue={{
                  primary: new Date(invoice.reportPeriod).toLocaleDateString(
                    'uk-UA',
                    {
                      year: 'numeric',
                      month: 'numeric',
                    },
                  ),
                }}
              />
              <DocumentPageItem
                gridSpan={3}
                translationKey={{
                  primary: 'documents:documents.additionalInfo',
                }}
                baseValue={{
                  primary: invoice.contractInfo,
                }}
              />
            </Grid>
          </Card>

          {invoice.invoiceLines && (
            <HoldingTable
              tableOptions={invoiceLinesTableConfig}
              title={t('documents:documents.goods')}
            />
          )}

          {invoice.invoiceServiceLines?.length > 0 && (
            <HoldingTable
              tableOptions={invoiceServiceLinesTableConfig}
              title={t('documents:documents.services')}
            />
          )}
        </>
      )}
    </>
  );
}
