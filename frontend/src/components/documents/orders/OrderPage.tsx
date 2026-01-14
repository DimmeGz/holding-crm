import { type ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Card, Grid, Group, Text } from '@mantine/core';
import type { MRT_ColumnDef, MRT_TableOptions } from 'mantine-react-table';
import { IconCircle, IconCircleFilled } from '@tabler/icons-react';
import { OrderPageItem } from '@/components/documents/orders/OrderPageItem';
import { HoldingTable } from '@/components/shared/HoldingTable';
import { Spinner } from '@/components/shared/Spinner';
import { CommonConstants } from '@/constants/common.constants';
import { StylesConstants } from '@/constants/styles.constants';
import { useOrderLinesColumns } from '@/hooks/documents/table-columns/useOrderLinesColumns';
import { useOrder } from '@/hooks/documents/useOrders';
import type { Order, OrderLine } from '@/types/documents/orders.types';

export function OrderPage(): ReactNode {
  const { t } = useTranslation(['documents']),
    { id } = useParams<{ id: string }>(),
    { data, loading, error } = useOrder(Number(id)),
    order: Order | undefined = data?.order,
    hasConfirmation: boolean = Boolean(order?.confirmation),
    columns: MRT_ColumnDef<OrderLine>[] = useOrderLinesColumns(
      order?.currency.name || CommonConstants.EMPTY_STRING,
    ),
    orderLinesTableConfig: MRT_TableOptions<OrderLine> = useMemo(
      () => ({
        data: order?.orderLines || [],
        columns,
        enablePagination: false,
        enableSorting: false,
        enableColumnFilters: false,
        enableTopToolbar: false,
        enableBottomToolbar: false,
        enableColumnActions: false,
        mantinePaperProps: {
          shadow: 'sm',
          radius: 'md',
        },
      }),
      [order, columns],
    );

  return (
    <>
      {loading && <Spinner />}

      {!loading && error && <h3>Помилка завантаження даних: {error}</h3>}

      {!loading && !error && order && (
        <div>
          <Card shadow='sm' p='md' radius='md' withBorder mb='xs' mt='6'>
            <Grid gutter='xs' align='flex-start'>
              <Grid.Col span={hasConfirmation ? 8 : 12}>
                <Group justify='flex-start' wrap='nowrap' gap='2'>
                  {order.status ? (
                    <IconCircleFilled color='green' />
                  ) : (
                    <IconCircle color='grey' stroke={5} />
                  )}
                  <Text
                    size='lg'
                    fw={StylesConstants.HEAVY_FONT_WEIGHT}
                    ml='xs'
                  >
                    {t('documents:documents.order')} №{order.orderNumber}
                  </Text>
                </Group>
              </Grid.Col>

              {order.confirmation && (
                <Grid.Col span={4}>
                  <Text size='lg' fw={StylesConstants.HEAVY_FONT_WEIGHT}>
                    {t('documents:documents.confirm')} №
                    {order.confirmation.confirmationNumber}
                  </Text>
                </Grid.Col>
              )}

              <Grid.Col span={hasConfirmation ? 4 : 6}>
                <Text size='sm' fw={StylesConstants.DEFAULT_FONT_WEIGHT}>
                  {t('documents:documents.byContract')}: {order.contract.name}
                </Text>
              </Grid.Col>
              <Grid.Col span={hasConfirmation ? 4 : 6}>
                <Text size='sm' fw={StylesConstants.DEFAULT_FONT_WEIGHT}>
                  {t('documents:documents.createdAt')}:{' '}
                  {new Date(order.createdAt).toLocaleDateString('uk-UA')}
                </Text>
              </Grid.Col>
              {order.confirmation && (
                <Grid.Col span={4}>
                  <Text size='sm' fw={StylesConstants.DEFAULT_FONT_WEIGHT}>
                    {t('documents:documents.createdAt')}:{' '}
                    {new Date(order.confirmation.createdAt).toLocaleDateString(
                      'uk-UA',
                    )}
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
              <OrderPageItem
                gridSpan={order.recipient ? 4 : 6}
                translationKey={{
                  primary: 'documents:documents.seller',
                  secondary: 'documents:documents.warehouse',
                }}
                baseValue={{
                  primary: order.seller.name,
                  secondary: order.sellerWarehouse.name,
                }}
                confirmValue={
                  order.confirmation
                    ? {
                        primary: order.seller.name,
                        secondary: order.sellerWarehouse.name,
                      }
                    : undefined
                }
              />
              <OrderPageItem
                gridSpan={hasConfirmation ? 4 : 6}
                translationKey={{
                  primary: 'documents:documents.buyer',
                  secondary: 'documents:documents.warehouse',
                }}
                baseValue={{
                  primary: order.buyer.name,
                  secondary: order.buyerWarehouse.name,
                }}
                confirmValue={
                  order.confirmation
                    ? {
                        primary: order.buyer.name,
                        secondary: order.confirmation.buyerWarehouse.name,
                      }
                    : undefined
                }
              />

              {order.recipient && (
                <OrderPageItem
                  gridSpan={4}
                  translationKey={{
                    primary: 'documents:documents.recipient',
                    secondary: 'documents:documents.warehouse',
                  }}
                  baseValue={{
                    primary: order.recipient.name,
                    secondary: order.recipientWarehouse?.name,
                  }}
                  confirmValue={
                    order.confirmation
                      ? {
                          primary: order.confirmation.recipient?.name,
                          secondary:
                            order.confirmation.recipientWarehouse?.name,
                        }
                      : undefined
                  }
                />
              )}
            </Grid>
          </Card>

          <Card shadow='sm' p='md' radius='md' withBorder mb='sm'>
            <Text fw={StylesConstants.HEAVY_FONT_WEIGHT} size='md' mb='5'>
              {t('documents:documents.payDelivery')}
            </Text>
            <Grid gutter='md' align='flex-start'>
              <OrderPageItem
                gridSpan={3}
                translationKey={{
                  primary: 'documents:documents.expectedDate',
                }}
                baseValue={{
                  primary: new Date(order.expectedDate).toLocaleDateString(
                    'uk-UA',
                  ),
                }}
                confirmValue={
                  order.confirmation
                    ? {
                        primary: new Date(
                          order.confirmation.expectedDate,
                        ).toLocaleDateString('uk-UA'),
                      }
                    : undefined
                }
              />
              <OrderPageItem
                gridSpan={3}
                translationKey={{
                  primary: 'documents:documents.vat',
                }}
                baseValue={{
                  primary: `${order.vat} %`,
                }}
              />
              <OrderPageItem
                gridSpan={3}
                translationKey={{
                  primary: 'documents:documents.paymentDelay',
                }}
                baseValue={{
                  primary: `${order.paymentDelay} ${t('documents:documents.days')}`,
                }}
                confirmValue={{
                  primary: order.confirmation
                    ? `${order.confirmation?.paymentDelay} ${t('documents:documents.days')}`
                    : undefined,
                }}
              />
              <OrderPageItem
                gridSpan={3}
                translationKey={{
                  primary: 'documents:documents.incoterms',
                }}
                baseValue={{
                  primary: order.incoterms,
                }}
                confirmValue={{
                  primary: order.confirmation?.incoterms,
                }}
              />
            </Grid>
          </Card>

          {order.orderLines && (
            <HoldingTable tableOptions={orderLinesTableConfig} />
          )}
        </div>
      )}
    </>
  );
}
