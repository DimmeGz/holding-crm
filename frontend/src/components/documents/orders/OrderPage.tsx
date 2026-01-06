import { type ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Card, Grid, Group, Text } from '@mantine/core';
import type { MRT_ColumnDef, MRT_TableOptions } from 'mantine-react-table';
import { IconCircle, IconCircleFilled } from '@tabler/icons-react';
import { HoldingTable } from '@/components/shared/HoldingTable';
import { Spinner } from '@/components/shared/Spinner';
import { CommonConstants } from '@/constants/common.constants';
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
            <Grid gutter='xs' align='center'>
              <Grid.Col span={hasConfirmation ? 6 : 12}>
                <Group justify='flex-start' wrap='nowrap' gap='2'>
                  {order.status ? (
                    <IconCircleFilled color='green' />
                  ) : (
                    <IconCircle color='grey' stroke={5} />
                  )}
                  <Text size='lg' fw={700} ml='xs'>
                    {t('documents:documents.order')} №{order.orderNumber}
                  </Text>
                </Group>
              </Grid.Col>

              {order.confirmation && (
                <Grid.Col span={6}>
                  <Text size='lg' fw={700}>
                    {t('documents:documents.confirm')} №{order.confirmation.confirmationNumber}
                  </Text>
                </Grid.Col>
              )}

              <Grid.Col span={hasConfirmation ? 3 : 6}>
                <Text size='sm' fw={500}>
                  {t('documents:documents.byContract')}: {order.contract.name}
                </Text>
              </Grid.Col>
              <Grid.Col span={hasConfirmation ? 3 : 6}>
                <Text size='sm' fw={500}>
                  {t('documents:documents.createdAt')}:{' '}
                  {new Date(order.createdAt).toLocaleDateString('uk-UA')}
                </Text>
              </Grid.Col>
              {order.confirmation && (
                <Grid.Col span={6}>
                  <Text size='sm' fw={500}>
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
            <Text fw={700} size='md' mb='5'>
              {t('documents:documents.mainInfo')}
            </Text>
            <Grid gutter='md' align='center'>
              <Grid.Col span={hasConfirmation ? 3 : 6}>
                <Text size='md' fw={500}>
                  {t('documents:documents.seller')}:
                </Text>
                <div className='flex gap-xs'>
                  <Text size='sm' fw={700}>
                    {order.seller.name}
                  </Text>
                  <Text size='sm' fw={500} ml={5} c='dimmed'>
                    ({t('documents:documents.warehouse')}:{' '}
                    {order.sellerWarehouse.name})
                  </Text>
                </div>
              </Grid.Col>
              <Grid.Col span={hasConfirmation ? 3 : 6}>
                <div>
                  <Text size='md' fw={500}>
                    {t('documents:documents.buyer')}:
                  </Text>
                  <div className='flex gap-xs'>
                    <Text size='sm' fw={700}>
                      {order.buyer.name}
                    </Text>
                    <Text size='sm' fw={500} ml={5} c='dimmed'>
                      ({t('documents:documents.warehouse')}:{' '}
                      {order.buyerWarehouse.name})
                    </Text>
                  </div>
                </div>
              </Grid.Col>

              {order.confirmation && (
                <>
                  <Grid.Col span={hasConfirmation ? 3 : 6}>
                    <Text size='md' fw={500}>
                      {t('documents:documents.seller')}:
                    </Text>
                    <div className='flex gap-xs'>
                      <Text size='sm' fw={700}>
                        {order.seller.name}
                      </Text>
                      <Text size='sm' fw={500} ml={5} c='dimmed'>
                        ({t('documents:documents.warehouse')}:{' '}
                        {order.sellerWarehouse.name})
                      </Text>
                    </div>
                  </Grid.Col>
                  <Grid.Col span={hasConfirmation ? 3 : 6}>
                    <div>
                      <Text size='md' fw={500}>
                        {t('documents:documents.buyer')}:
                      </Text>
                      <div className='flex gap-xs'>
                        <Text size='sm' fw={700}>
                          {order.buyer.name}
                        </Text>
                        <Text size='sm' fw={500} ml={5} c='dimmed'>
                          ({t('documents:documents.warehouse')}:{' '}
                          {order.confirmation.buyerWarehouse.name})
                        </Text>
                      </div>
                    </div>
                  </Grid.Col>
                </>
              )}

              {order.recipient && (
                <Grid.Col span={hasConfirmation ? 6 : 12}>
                  <div>
                    <Text size='md' fw={500}>
                      {t('documents:documents.recipient')}:
                    </Text>
                    <div className='flex gap-xs'>
                      <Text size='sm' fw={700}>
                        {order.recipient.name}
                      </Text>
                      <Text size='sm' fw={500} ml={5} c='dimmed'>
                        ({t('documents:documents.warehouse')}:{' '}
                        {order.recipientWarehouse?.name})
                      </Text>
                    </div>
                  </div>
                </Grid.Col>
              )}
              {order.confirmation && order.confirmation.recipient && (
                <Grid.Col span={6}>
                  <div>
                    <Text size='md' fw={500}>
                      {t('documents:documents.recipient')}:
                    </Text>
                    <div className='flex gap-xs'>
                      <Text size='sm' fw={700}>
                        {order.confirmation.recipient.name}
                      </Text>
                      <Text size='sm' fw={500} ml={5} c='dimmed'>
                        ({t('documents:documents.warehouse')}:{' '}
                        {order.confirmation.recipientWarehouse?.name})
                      </Text>
                    </div>
                  </div>
                </Grid.Col>
              )}
            </Grid>
          </Card>

          <Card shadow='sm' p='md' radius='md' withBorder mb='sm'>
            <Text fw={700} size='md' mb='5'>
              {t('documents:documents.payDelivery')}
            </Text>
            <Grid gutter='md' align='center'>
              <Grid.Col span={hasConfirmation ? 3 : 6}>
                <Text size='md' fw={500}>
                  {t('documents:documents.expectedDate')}:
                </Text>
                <Text size='sm' fw={700}>
                  {new Date(order.expectedDate).toLocaleDateString('uk-UA')}
                </Text>
              </Grid.Col>
              <Grid.Col span={hasConfirmation ? 3 : 6}>
                <Text size='md' fw={500}>
                  {t('documents:documents.vat')}:
                </Text>
                <Text size='sm' fw={700}>
                  {order.vat} %
                </Text>
              </Grid.Col>
              {order.confirmation && (
                <>
                  <Grid.Col span={hasConfirmation ? 3 : 6}>
                    <Text size='md' fw={500}>
                      {t('documents:documents.expectedDate')}:
                    </Text>
                    <Text size='sm' fw={700}>
                      {new Date(order.confirmation.expectedDate).toLocaleDateString('uk-UA')}
                    </Text>
                  </Grid.Col>
                  <Grid.Col span={hasConfirmation ? 3 : 6}>
                    <Text size='md' fw={500}>
                      {t('documents:documents.vat')}:
                    </Text>
                    <Text size='sm' fw={700}>
                      {order.vat} %
                    </Text>
                  </Grid.Col>
                </>
              )}

              <Grid.Col span={hasConfirmation ? 3 : 6}>
                <Text size='md' fw={500}>
                  {t('documents:documents.paymentDelay')}:
                </Text>
                <Text size='sm' fw={700}>
                  {order.paymentDelay} {t('documents:documents.days')}
                </Text>
              </Grid.Col>
              <Grid.Col span={hasConfirmation ? 3 : 6}>
                <Text size='md' fw={500}>
                  {t('documents:documents.incoterms')}:
                </Text>
                <Text size='sm' fw={700}>
                  {order.incoterms}
                </Text>
              </Grid.Col>
              {order.confirmation && (
                <>
                  <Grid.Col span={hasConfirmation ? 3 : 6}>
                    <Text size='md' fw={500}>
                      {t('documents:documents.paymentDelay')}:
                    </Text>
                    <Text size='sm' fw={700}>
                      {order.confirmation.paymentDelay} {t('documents:documents.days')}
                    </Text>
                  </Grid.Col>
                  <Grid.Col span={hasConfirmation ? 3 : 6}>
                    <Text size='md' fw={500}>
                      {t('documents:documents.incoterms')}:
                    </Text>
                    <Text size='sm' fw={700}>
                      {order.confirmation.incoterms}
                    </Text>
                  </Grid.Col>
                </>
              )}
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
