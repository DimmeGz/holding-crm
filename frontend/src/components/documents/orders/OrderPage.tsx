import { type ChangeEvent, type ReactNode, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Grid, Group, Switch, Text } from '@mantine/core';
import type { MRT_ColumnDef, MRT_TableOptions } from 'mantine-react-table';
import { IconCircle, IconCircleFilled } from '@tabler/icons-react';
import { DocumentActions } from '@/components/documents/common/DocumentActions';
import { DocumentPageItem } from '@/components/documents/common/DocumentPageItem';
import { ConfirmActionModal } from '@/components/shared/ConfirmActionModal';
import { HoldingTable } from '@/components/shared/HoldingTable';
import { Spinner } from '@/components/shared/Spinner';
import { CommonConstants } from '@/constants/common.constants';
import { StylesConstants } from '@/constants/styles.constants';
import { UrlConstants } from '@/constants/url-constants';
import { showError, showSuccess } from '@/helpers/notifications.helpers';
import { useOrderLinesColumns } from '@/hooks/documents/table-columns/useOrderLinesColumns';
import { useOrder } from '@/hooks/documents/useOrders';
import { useMutation } from '@/hooks/useMutation';
import { OrdersService } from '@/services/documents/orders.service';
import { useLibsStore } from '@/stores/useLibsStore';
import type { Order, OrderLine } from '@/types/documents/orders.types';

type PendingAction = 'delete' | 'changeStatus' | null;

export function OrderPage(): ReactNode {
  const { t } = useTranslation(['common', 'documents']);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const orderId = Number(id);
  const { data, loading, error, refetch } = useOrder(orderId);
  const getCompanyName = useLibsStore(s => s.getCompanyName);
  const getWarehouseName = useLibsStore(s => s.getWarehouseName);
  const getCurrencyName = useLibsStore(s => s.getCurrencyName);
  const order: Order | undefined = data?.order;
  const hasConfirmation: boolean = Boolean(order?.confirmation);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);

  const { loading: mutationLoading, mutateAsync: runRemove } = useMutation(
    (targetOrderId: number) => OrdersService.remove(targetOrderId),
    {
      onSuccess: () => {
        showSuccess(t('common:messages.deleteSuccess'));
        setPendingAction(null);
        navigate(UrlConstants.ORDERS_URL);
      },
      onError: (message: string) => {
        showError(message);
      },
    },
  );

  const { mutateAsync: runChangeStatus } = useMutation(
    (targetOrderId: number) => OrdersService.changeStatus(targetOrderId),
    {
      onSuccess: () => {
        showSuccess(t('common:messages.changeStatusSuccess'));
        setPendingAction(null);
        refetch();
      },
      onError: (message: string) => {
        showError(message);
      },
    },
  );

  const handleConfirm = useCallback((): void => {
    if (pendingAction === 'delete') {
      void runRemove(orderId);
      return;
    }

    if (pendingAction === 'changeStatus') {
      void runChangeStatus(orderId);
    }
  }, [orderId, pendingAction, runChangeStatus, runRemove]);

  const confirmModalProps =
    pendingAction === 'delete'
      ? {
          title: t('common:actions.confirmDelete'),
          message: t('common:messages.confirmDeleteMessage'),
          confirmLabel: t('common:actions.delete'),
          confirmColor: 'red',
        }
      : pendingAction === 'changeStatus'
        ? {
            title: t('common:actions.confirmChangeStatus'),
            message: t('common:messages.confirmChangeStatusMessage'),
            confirmLabel: t('common:actions.changeStatus'),
            confirmColor: 'blue',
          }
        : null;

  const columns: MRT_ColumnDef<OrderLine>[] = useOrderLinesColumns(
    order ? getCurrencyName(order.currencyId) : CommonConstants.EMPTY_STRING,
  );
  const orderLinesTableConfig: MRT_TableOptions<OrderLine> = useMemo(
    () => ({
      data: order?.orderLines || [],
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
    [order, columns],
  );
  const confirmOrderLinesTableConfig: MRT_TableOptions<OrderLine> | undefined =
    hasConfirmation
      ? {
          ...orderLinesTableConfig,
          columns: [...columns].filter(
            (column: MRT_ColumnDef<OrderLine>) => column.id !== 'batchRename',
          ),
          data: order?.confirmation?.orderLines || [],
        }
      : undefined;
  const [showConfirmLinesTable, setShowConfirmLinesTable] =
    useState<boolean>(false);

  return (
    <>
      {loading && <Spinner />}

      {!loading && error && (
        <h3>
          {t('common:messages.error')} {error}
        </h3>
      )}

      {!loading && !error && order && (
        <>
          <Card shadow='sm' p='md' radius='md' withBorder mb='xs' mt='6'>
            <Group justify='space-between' align='flex-start' mb='xs'>
              <Grid gutter='xs' align='flex-start' style={{ flex: 1 }}>
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
                    {t('documents:documents.order')} {CommonConstants.NUMBER}
                    {order.orderNumber}
                  </Text>
                </Group>
              </Grid.Col>

              {order.confirmation && (
                <Grid.Col span={4}>
                  <Text size='lg' fw={StylesConstants.HEAVY_FONT_WEIGHT}>
                    {t('documents:documents.confirm')} {CommonConstants.NUMBER}
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
              <DocumentActions
                loading={mutationLoading}
                onDelete={() => setPendingAction('delete')}
                onChangeStatus={() => setPendingAction('changeStatus')}
                canEdit={false}
              />
            </Group>
          </Card>

          {confirmModalProps && (
            <ConfirmActionModal
              opened={pendingAction !== null}
              title={confirmModalProps.title}
              message={confirmModalProps.message}
              confirmLabel={confirmModalProps.confirmLabel}
              cancelLabel={t('common:actions.cancel')}
              confirmColor={confirmModalProps.confirmColor}
              loading={mutationLoading}
              onConfirm={handleConfirm}
              onCancel={() => setPendingAction(null)}
            />
          )}

          <Card shadow='sm' p='md' radius='md' withBorder mb='sm'>
            <Text fw={StylesConstants.HEAVY_FONT_WEIGHT} size='md' mb='5'>
              {t('documents:documents.mainInfo')}
            </Text>
            <Grid gutter='md' align='flex-start'>
              <DocumentPageItem
                gridSpan={order.recipientId ? 4 : 6}
                translationKey={{
                  primary: 'documents:documents.seller',
                  secondary: 'documents:documents.warehouse',
                }}
                baseValue={{
                  primary: getCompanyName(order.sellerId),
                  secondary: getWarehouseName(order.sellerWarehouseId),
                }}
                confirmValue={
                  order.confirmation
                    ? {
                        primary: getCompanyName(order.sellerId),
                        secondary: getWarehouseName(order.sellerWarehouseId),
                      }
                    : undefined
                }
              />
              <DocumentPageItem
                gridSpan={order.recipientId ? 4 : 6}
                translationKey={{
                  primary: 'documents:documents.buyer',
                  secondary: 'documents:documents.warehouse',
                }}
                baseValue={{
                  primary: getCompanyName(order.buyerId),
                  secondary: getWarehouseName(order.buyerWarehouseId),
                }}
                confirmValue={
                  order.confirmation
                    ? {
                        primary: getCompanyName(order.buyerId),
                        secondary: getWarehouseName(
                          order.confirmation.buyerWarehouseId,
                        ),
                      }
                    : undefined
                }
              />

              {order.recipientId && order.recipientWarehouseId && (
                <DocumentPageItem
                  gridSpan={4}
                  translationKey={{
                    primary: 'documents:documents.recipient',
                    secondary: 'documents:documents.warehouse',
                  }}
                  baseValue={{
                    primary: getCompanyName(order.recipientId),
                    secondary: getWarehouseName(order.recipientWarehouseId),
                  }}
                  confirmValue={
                    order.confirmation?.recipientId &&
                    order.confirmation.recipientWarehouseId
                      ? {
                          primary: getCompanyName(
                            order.confirmation.recipientId,
                          ),
                          secondary: getWarehouseName(
                            order.confirmation.recipientWarehouseId,
                          ),
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
              <DocumentPageItem
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
              <DocumentPageItem
                gridSpan={3}
                translationKey={{
                  primary: 'documents:documents.vat',
                }}
                baseValue={{
                  primary: `${order.vat} %`,
                }}
              />
              <DocumentPageItem
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
              <DocumentPageItem
                gridSpan={3}
                translationKey={{
                  primary: 'documents:documents.incoterms',
                }}
                baseValue={{
                  primary: order.incoterms
                    ? [order.incoterms.name, order.transportPlace].join(
                        CommonConstants.COMA_SPACE,
                      )
                    : CommonConstants.EMPTY_STRING,
                }}
                confirmValue={{
                  primary: order.confirmation?.incoterms
                    ? [
                        order.confirmation.incoterms.name,
                        order.confirmation.transportPlace,
                      ].join(CommonConstants.COMA_SPACE)
                    : CommonConstants.EMPTY_STRING,
                }}
              />
            </Grid>
          </Card>
          {order.orderLines && !showConfirmLinesTable && (
            <HoldingTable
              tableOptions={orderLinesTableConfig}
              title={t('documents:documents.goods')}
              toolBarControls={
                <Switch
                  checked={showConfirmLinesTable}
                  onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    setShowConfirmLinesTable(event.currentTarget.checked)
                  }
                  label={
                    showConfirmLinesTable
                      ? t('documents:documents.confirm').toLowerCase()
                      : t('documents:documents.order').toLowerCase()
                  }
                  labelPosition='left'
                  mr='md'
                  hidden={!hasConfirmation}
                />
              }
            />
          )}
          {order.confirmation?.orderLines &&
            showConfirmLinesTable &&
            confirmOrderLinesTableConfig && (
              <HoldingTable
                tableOptions={confirmOrderLinesTableConfig}
                title={t('documents:documents.goods')}
                toolBarControls={
                  <Switch
                    checked={showConfirmLinesTable}
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      setShowConfirmLinesTable(event.currentTarget.checked)
                    }
                    label={
                      showConfirmLinesTable
                        ? t('documents:documents.confirm').toLowerCase()
                        : t('documents:documents.order').toLowerCase()
                    }
                    labelPosition='left'
                    mr='md'
                    hidden={!hasConfirmation}
                  />
                }
              />
            )}
        </>
      )}
    </>
  );
}
