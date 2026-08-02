import { type ReactNode, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Grid, Group, Text } from '@mantine/core';
import { IconCircle, IconCircleFilled } from '@tabler/icons-react';
import type { MRT_ColumnDef, MRT_TableOptions } from 'mantine-react-table';
import { DocumentActions } from '@/components/documents/common/DocumentActions';
import { DocumentLinkItem } from '@/components/documents/common/DocumentLinkItem';
import { DocumentPageItem } from '@/components/documents/common/DocumentPageItem';
import { ConfirmActionModal } from '@/components/shared/ConfirmActionModal';
import { HoldingTable } from '@/components/shared/HoldingTable';
import { Spinner } from '@/components/shared/Spinner';
import { CommonConstants } from '@/constants/common.constants';
import { StylesConstants } from '@/constants/styles.constants';
import { UrlConstants } from '@/constants/url-constants';
import { showError, showSuccess } from '@/helpers/notifications.helpers';
import { useReceiveLinesColumns } from '@/hooks/documents/table-columns/useReceiveLinesColumns';
import { useReceiveServiceLinesColumns } from '@/hooks/documents/table-columns/useReceiveServiceLinesColumns';
import { useReceive } from '@/hooks/documents/useReceives';
import { useMutation } from '@/hooks/useMutation';
import { ReceivesService } from '@/services/documents/receives.service';
import { useLibsStore } from '@/stores/useLibsStore';
import type {
  ReceiveLine,
  ReceiveServiceLine,
} from '@/types/documents/receives.types';

type PendingAction = 'delete' | 'changeStatus' | null;

export function ReceivePage(): ReactNode {
  const { t } = useTranslation(['common', 'documents', 'tables']);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const receiveId = Number(id);
  const { data: receive, loading, error, refetch } = useReceive(receiveId);
  const getCompanyName = useLibsStore(s => s.getCompanyName);
  const getWarehouseName = useLibsStore(s => s.getWarehouseName);
  const getCurrencyName = useLibsStore(s => s.getCurrencyName);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);

  const { loading: mutationLoading, mutateAsync: runRemove } = useMutation(
    (targetReceiveId: number) => ReceivesService.remove(targetReceiveId),
    {
      onSuccess: () => {
        showSuccess(t('common:messages.deleteSuccess'));
        setPendingAction(null);
        navigate(UrlConstants.RECEIVES_URL);
      },
      onError: (message: string) => {
        showError(message);
      },
    },
  );

  const { mutateAsync: runChangeStatus } = useMutation(
    (targetReceiveId: number) => ReceivesService.changeStatus(targetReceiveId),
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
      void runRemove(receiveId);
      return;
    }

    if (pendingAction === 'changeStatus') {
      void runChangeStatus(receiveId);
    }
  }, [pendingAction, receiveId, runChangeStatus, runRemove]);

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

  const currencyName = receive
    ? getCurrencyName(receive.currencyId)
    : CommonConstants.EMPTY_STRING;
  const columns: MRT_ColumnDef<ReceiveLine>[] =
    useReceiveLinesColumns(currencyName);
  const serviceColumns: MRT_ColumnDef<ReceiveServiceLine>[] =
    useReceiveServiceLinesColumns(currencyName);
  const receiveLinesTableConfig: MRT_TableOptions<ReceiveLine> = useMemo(
    () => ({
      data: receive?.receiveLines || [],
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
    [receive, columns],
  );
  const receiveServiceLinesTableConfig: MRT_TableOptions<ReceiveServiceLine> =
    useMemo(
      () => ({
        data: receive?.receiveServiceLines || [],
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
      [receive, serviceColumns],
    );

  return (
    <>
      {loading && <Spinner />}

      {!loading && error && (
        <h3>
          {t('common:messages.error')} {error}
        </h3>
      )}

      {!loading && !error && receive && (
        <>
          <Card shadow='sm' p='md' radius='md' withBorder mb='xs' mt='6'>
            <Group justify='space-between' align='flex-start'>
              <Grid gutter='xs' align='flex-start' style={{ flex: 1 }}>
                <Grid.Col span={12}>
                  <Group justify='flex-start' wrap='nowrap' gap='2'>
                    {receive.status ? (
                      <IconCircleFilled color='green' />
                    ) : (
                      <IconCircle color='grey' stroke={5} />
                    )}
                    <Text
                      size='lg'
                      fw={StylesConstants.HEAVY_FONT_WEIGHT}
                      ml='xs'
                    >
                      {t('documents:documents.receive')}{' '}
                      {CommonConstants.NUMBER}
                      {receive.id}
                    </Text>
                  </Group>
                </Grid.Col>

                <Grid.Col span={12}>
                  <Text size='sm' fw={StylesConstants.DEFAULT_FONT_WEIGHT}>
                    {t('tables:columns.expectedDate')}:{' '}
                    {new Date(receive.expectedDate).toLocaleDateString('uk-UA')}
                  </Text>
                </Grid.Col>
              </Grid>
              <DocumentActions
                loading={mutationLoading}
                canEdit={!receive.status}
                canDelete={!receive.status}
                onEdit={() =>
                  navigate(`${UrlConstants.RECEIVES_URL}/${receiveId}/edit`)
                }
                onDelete={() => setPendingAction('delete')}
                onChangeStatus={() => setPendingAction('changeStatus')}
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
                gridSpan={6}
                translationKey={{ primary: 'documents:documents.seller' }}
                baseValue={{ primary: getCompanyName(receive.sellerId) }}
              />
              <DocumentPageItem
                gridSpan={6}
                translationKey={{
                  primary: 'documents:documents.buyer',
                  secondary: 'documents:documents.warehouse',
                }}
                baseValue={{
                  primary: getCompanyName(receive.buyerId),
                  secondary: getWarehouseName(receive.buyerWarehouseId),
                }}
              />
            </Grid>
          </Card>

          <Card shadow='sm' p='md' radius='md' withBorder mb='sm'>
            <Text fw={StylesConstants.HEAVY_FONT_WEIGHT} size='md' mb='5'>
              {t('documents:documents.payDelivery')}
            </Text>
            <Grid gutter='md' align='flex-start'>
              {receive.shipment?.id && (
                <DocumentLinkItem
                  gridSpan={4}
                  translationKey='documents:documents.byShipment'
                  value={{
                    label: `${CommonConstants.NUMBER}${receive.shipment.id}`,
                    uri: `${UrlConstants.SHIPMENTS_URL}/${receive.shipment.id}`,
                  }}
                />
              )}
              {receive.shipment?.invoice?.id && (
                <DocumentLinkItem
                  gridSpan={4}
                  translationKey='documents:documents.byInvoice'
                  value={{
                    label: `${receive.shipment.invoice.invoiceNumber}`,
                    uri: `${UrlConstants.INVOICES_URL}/${receive.shipment.invoice.id}`,
                  }}
                />
              )}
              <DocumentPageItem
                gridSpan={4}
                translationKey={{ primary: 'documents:documents.incoterms' }}
                baseValue={{
                  primary: receive.incoterms
                    ? [receive.incoterms.name, receive.transportPlace].join(
                        CommonConstants.COMA_SPACE,
                      )
                    : receive.transportPlace,
                }}
              />
              <DocumentPageItem
                gridSpan={4}
                translationKey={{
                  primary: 'documents:documents.transportAmount',
                }}
                baseValue={{
                  primary: `${receive.transportAmount} ${currencyName}`,
                }}
              />
            </Grid>
          </Card>

          {receive.receiveLines && (
            <HoldingTable
              tableOptions={receiveLinesTableConfig}
              title={t('documents:documents.goods')}
            />
          )}

          {receive.receiveServiceLines &&
            receive.receiveServiceLines.length > 0 && (
              <HoldingTable
                tableOptions={receiveServiceLinesTableConfig}
                title={t('documents:documents.services')}
              />
            )}
        </>
      )}
    </>
  );
}
