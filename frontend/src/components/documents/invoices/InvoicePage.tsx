import { type ReactNode, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Card, Grid, Group, Text, Tooltip } from '@mantine/core';
import type { MRT_ColumnDef, MRT_TableOptions } from 'mantine-react-table';
import { IconCircle, IconCircleFilled } from '@tabler/icons-react';
import { DocumentActions } from '@/components/documents/common/DocumentActions';
import { DocumentPageItem } from '@/components/documents/common/DocumentPageItem';
import { ConfirmActionModal } from '@/components/shared/ConfirmActionModal';
import { HoldingTable } from '@/components/shared/HoldingTable';
import { Spinner } from '@/components/shared/Spinner';
import { CommonConstants } from '@/constants/common.constants';
import { CompanyType } from '@/constants/company-type.constants';
import { StylesConstants } from '@/constants/styles.constants';
import { UrlConstants } from '@/constants/url-constants';
import {
  showError,
  showSuccess,
  showWarning,
} from '@/helpers/notifications.helpers';
import { useInvoiceLinesColumns } from '@/hooks/documents/table-columns/useInvoiceLinesColumns';
import { useInvoiceServiceLinesColumns } from '@/hooks/documents/table-columns/useInvoiceServiceLinesColumns';
import { useInvoice } from '@/hooks/documents/useInvoices';
import { useMutation } from '@/hooks/useMutation';
import { InvoicesService } from '@/services/documents/invoices.service';
import { useLibsStore } from '@/stores/useLibsStore';
import type {
  Invoice,
  InvoiceLine,
  InvoiceServiceLine,
} from '@/types/documents/invoices.types';

type PendingAction = 'delete' | 'changeStatus' | 'shipReceive' | null;

export function InvoicePage(): ReactNode {
  const { t } = useTranslation(['common', 'documents']);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const invoiceId = Number(id);
  const { data, loading, error, refetch } = useInvoice(invoiceId);
  const getCompanyName = useLibsStore(s => s.getCompanyName);
  const getWarehouseName = useLibsStore(s => s.getWarehouseName);
  const getCurrencyName = useLibsStore(s => s.getCurrencyName);
  const companyTypes = useLibsStore(s => s.companyTypes);
  const invoice: Invoice | undefined = data?.invoice;
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);

  const { loading: removeLoading, mutateAsync: runRemove } = useMutation(
    (targetInvoiceId: number) => InvoicesService.remove(targetInvoiceId),
    {
      onSuccess: () => {
        showSuccess(t('common:messages.deleteSuccess'));
        setPendingAction(null);
        navigate(UrlConstants.INVOICES_URL);
      },
      onError: (message: string) => {
        showError(message);
      },
    },
  );

  const { loading: changeStatusLoading, mutateAsync: runChangeStatus } =
    useMutation(
      (targetInvoiceId: number) => InvoicesService.changeStatus(targetInvoiceId),
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

  const { loading: shipReceiveLoading, mutateAsync: runShipReceive } =
    useMutation(
      (targetInvoiceId: number) => InvoicesService.shipReceive(targetInvoiceId),
      {
        onSuccess: result => {
          showSuccess(t('common:messages.saveSuccess'));
          setPendingAction(null);
          navigate(`${UrlConstants.RECEIVES_URL}/${result.receiveId}`);
        },
        onError: (message: string) => {
          showError(message);
        },
      },
    );

  const mutationLoading =
    removeLoading || changeStatusLoading || shipReceiveLoading;

  const handleConfirm = useCallback((): void => {
    if (pendingAction === 'delete') {
      void runRemove(invoiceId);
      return;
    }

    if (pendingAction === 'changeStatus') {
      void runChangeStatus(invoiceId);
      return;
    }

    if (pendingAction === 'shipReceive') {
      void runShipReceive(invoiceId);
    }
  }, [
    invoiceId,
    pendingAction,
    runChangeStatus,
    runRemove,
    runShipReceive,
  ]);

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
        : pendingAction === 'shipReceive'
          ? {
              title: t('documents:documents.confirmFastShipReceive'),
              message: t('documents:documents.confirmFastShipReceiveMessage'),
              confirmLabel: t('documents:documents.fastShipReceive'),
              confirmColor: 'blue',
            }
          : null;

  const createShipmentLabel =
    companyTypes[invoice?.sellerId ?? 0] !== CompanyType.INNER_COMPANY
      ? t('documents:documents.createDeliveryNote')
      : t('documents:documents.createShipment');

  const handleCreateShipment = useCallback((): void => {
    if (invoice?.shipments && invoice.shipments.length > 0) {
      showWarning(t('documents:documents.shipmentAlreadyExistsWarning'));
    }
    navigate(`${UrlConstants.SHIPMENTS_URL}/new?invoiceId=${invoiceId}`);
  }, [invoice?.shipments, invoiceId, navigate, t]);

  const columns: MRT_ColumnDef<InvoiceLine>[] = useInvoiceLinesColumns(
    invoice ? getCurrencyName(invoice.currencyId) : CommonConstants.EMPTY_STRING,
    invoiceId,
  );
  const serviceColumns: MRT_ColumnDef<InvoiceServiceLine>[] =
    useInvoiceServiceLinesColumns(
      invoice
        ? getCurrencyName(invoice.currencyId)
        : CommonConstants.EMPTY_STRING,
    );
  const invoiceLinesTableConfig: MRT_TableOptions<InvoiceLine> = useMemo(
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
  );
  const invoiceServiceLinesTableConfig: MRT_TableOptions<InvoiceServiceLine> =
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
          mt: 'sm',
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
            <Group justify='space-between' align='flex-start'>
              <Grid gutter='xs' align='flex-start' style={{ flex: 1 }}>
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
              <DocumentActions
                loading={mutationLoading}
                canEdit={!invoice.status}
                canDelete={!invoice.status}
                onEdit={() =>
                  navigate(`${UrlConstants.INVOICES_URL}/${invoiceId}/edit`)
                }
                onDelete={() => setPendingAction('delete')}
                onChangeStatus={() => setPendingAction('changeStatus')}
              />
            </Group>
            <Group justify='flex-end' mt='xs'>
              <Button
                variant='light'
                size='xs'
                component={Link}
                to={`${UrlConstants.PAYMENTS_URL}/new?invoiceIds=${invoiceId}`}
              >
                {t('documents:documents.createPayment')}
              </Button>
              <Button
                variant='light'
                size='xs'
                onClick={handleCreateShipment}
              >
                {createShipmentLabel}
              </Button>
              {invoice.status &&
                (invoice.canFastShipReceive ? (
                  <Button
                    variant='light'
                    size='xs'
                    loading={shipReceiveLoading}
                    onClick={() => setPendingAction('shipReceive')}
                  >
                    {t('documents:documents.fastShipReceive')}
                  </Button>
                ) : (
                  <Tooltip
                    label={t('documents:documents.fastShipReceiveImpossible')}
                  >
                    <Button variant='light' size='xs' disabled>
                      {t('documents:documents.fastShipReceiveImpossible')}
                    </Button>
                  </Tooltip>
                ))}
              {invoice.recipientId && (
                <>
                  <Button
                    variant='light'
                    size='xs'
                    component={Link}
                    to={`${UrlConstants.INVOICES_URL}/new?invoiceId=${invoiceId}`}
                  >
                    {t('documents:documents.createChildInvoice')}
                  </Button>
                  <Button
                    variant='light'
                    size='xs'
                    component={Link}
                    to={`${UrlConstants.COMMISSION_INVOICES_URL}/new?invoiceId=${invoiceId}`}
                  >
                    {t('documents:documents.createCommissionInvoice')}
                  </Button>
                </>
              )}
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
                  primary:
                    invoice.ponz?.toLocaleString() ??
                    CommonConstants.EMPTY_STRING,
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
                  primary: invoice.reportPeriod
                    ? new Date(invoice.reportPeriod).toLocaleDateString(
                        'uk-UA',
                        {
                          year: 'numeric',
                          month: 'numeric',
                        },
                      )
                    : CommonConstants.EMPTY_STRING,
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

          {invoice.shipments && invoice.shipments.length > 0 && (
            <Card shadow='sm' p='md' radius='md' withBorder mb='sm'>
              <Text fw={StylesConstants.HEAVY_FONT_WEIGHT} size='md' mb='5'>
                {t('documents:documents.relatedDocuments')}
              </Text>
              {invoice.shipments.map(shipment => (
                <Group key={shipment.id} gap='xs' mb='xs' align='flex-start'>
                  <Button
                    variant='light'
                    size='xs'
                    component={Link}
                    to={`${UrlConstants.SHIPMENTS_URL}/${shipment.id}`}
                  >
                    {t('documents:documents.shipment')} {CommonConstants.NUMBER}
                    {shipment.id}
                    {shipment.status
                      ? ` ${CommonConstants.CHECK_MARK}`
                      : ` ${CommonConstants.X_MARK}`}
                  </Button>
                  {shipment.receives?.map(receive => (
                    <Button
                      key={receive.id}
                      variant='light'
                      size='xs'
                      component={Link}
                      to={`${UrlConstants.RECEIVES_URL}/${receive.id}`}
                    >
                      {t('documents:documents.receive')}{' '}
                      {CommonConstants.NUMBER}
                      {receive.id}
                      {receive.status
                        ? ` ${CommonConstants.CHECK_MARK}`
                        : ` ${CommonConstants.X_MARK}`}
                    </Button>
                  ))}
                </Group>
              ))}
            </Card>
          )}

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
