import { DocumentPageItem } from '../common/DocumentPageItem';
import { type ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Card, Grid, Group, Text } from '@mantine/core';
import type { MRT_ColumnDef, MRT_TableOptions } from 'mantine-react-table';
import { IconCircle, IconCircleFilled } from '@tabler/icons-react';
import { HoldingTable } from '@/components/shared/HoldingTable';
import { Spinner } from '@/components/shared/Spinner';
import { CommonConstants } from '@/constants/common.constants';
import { StylesConstants } from '@/constants/styles.constants';
import { usePaymentLinesColumns } from '@/hooks/documents/table-columns/usePaymentLinesColumns';
import { usePayment } from '@/hooks/documents/usePayments';
import { useLibsStore } from '@/stores/useLibsStore';
import type { Payment, PaymentLine } from '@/types/documents/payments.types';

export function PaymentPage(): ReactNode {
  const { t } = useTranslation(['common', 'documents']),
    { id } = useParams<{ id: string }>(),
    { data, loading, error } = usePayment(Number(id)),
    getCompanyName: (id: number) => string = useLibsStore(
      s => s.getCompanyName,
    ),
    getCurrencyName: (id: number) => string = useLibsStore(
      s => s.getCurrencyName,
    ),
    payment: Payment | undefined = data?.payment,
    columns: MRT_ColumnDef<PaymentLine>[] = usePaymentLinesColumns(
      payment
        ? getCurrencyName(payment.currencyId)
        : CommonConstants.EMPTY_STRING,
    ),
    paymentLinesTableConfig: MRT_TableOptions<PaymentLine> = useMemo(
      () => ({
        data: payment?.paymentLines || [],
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
      [payment, columns],
    );

  return (
    <>
      {loading && <Spinner />}

      {!loading && error && (
        <h3>
          {t('common:messages.error')} {error}
        </h3>
      )}

      {!loading && !error && payment && (
        <>
          <Card shadow='sm' p='md' radius='md' withBorder mb='xs' mt='6'>
            <Grid gutter='xs' align='flex-start'>
              <Grid.Col span={12}>
                <Group justify='flex-start' wrap='nowrap' gap='2'>
                  {payment.status ? (
                    <IconCircleFilled color='green' />
                  ) : (
                    <IconCircle color='grey' stroke={5} />
                  )}
                  <Text
                    size='lg'
                    fw={StylesConstants.HEAVY_FONT_WEIGHT}
                    ml='xs'
                  >
                    {t('documents:documents.payment')} №{payment.id}
                  </Text>
                </Group>
              </Grid.Col>

              <Grid.Col span={12}>
                <Text size='sm' fw={StylesConstants.DEFAULT_FONT_WEIGHT}>
                  {t('tables:columns.paymentDate')}:{' '}
                  {new Date(payment.expectedDate).toLocaleDateString('uk-UA')}
                </Text>
              </Grid.Col>
            </Grid>
          </Card>

          <Card shadow='sm' p='md' radius='md' withBorder mb='sm'>
            <Text fw={StylesConstants.HEAVY_FONT_WEIGHT} size='md' mb='5'>
              {t('documents:documents.mainInfo')}
            </Text>
            <Grid gutter='md' align='flex-start'>
              <DocumentPageItem
                gridSpan={6}
                translationKey={{
                  primary: 'documents:documents.seller',
                }}
                baseValue={{
                  primary: getCompanyName(payment.sellerId),
                }}
              />
              <DocumentPageItem
                gridSpan={6}
                translationKey={{
                  primary: 'documents:documents.buyer',
                }}
                baseValue={{
                  primary: getCompanyName(payment.buyerId),
                }}
              />
            </Grid>
          </Card>

          {payment.paymentLines && (
            <HoldingTable
              tableOptions={paymentLinesTableConfig}
              title={t('documents:documents.goods')}
            />
          )}
        </>
      )}
    </>
  );
}
