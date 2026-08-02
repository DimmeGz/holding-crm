import { type ReactNode, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Card, Grid, Group, Text } from '@mantine/core';
import type { MRT_ColumnDef, MRT_TableOptions } from 'mantine-react-table';
import { IconCircle, IconCircleFilled } from '@tabler/icons-react';
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
import { useShipmentLinesColumns } from '@/hooks/documents/table-columns/useShipmentLinesColumns';
import { useShipmentServiceLinesColumns } from '@/hooks/documents/table-columns/useShipmentServiceLinesColumns';
import { useShipment } from '@/hooks/documents/useShipments';
import { useMutation } from '@/hooks/useMutation';
import { ShipmentsService } from '@/services/documents/shipments.service';
import { useLibsStore } from '@/stores/useLibsStore';
import type {
  Shipment,
  ShipmentLine,
  ShipmentServiceLine,
} from '@/types/documents/shipments.types';

type PendingAction = 'delete' | 'changeStatus' | null;

export function ShipmentPage(): ReactNode {
  const { t } = useTranslation(['common', 'documents']);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const shipmentId = Number(id);
  const { data, loading, error, refetch } = useShipment(shipmentId);
  const getCompanyName = useLibsStore(s => s.getCompanyName);
  const getWarehouseName = useLibsStore(s => s.getWarehouseName);
  const getCurrencyName = useLibsStore(s => s.getCurrencyName);
  const shipment: Shipment | undefined = data?.shipment;
  const receives = data?.receives ?? [];
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);

  const { loading: mutationLoading, mutateAsync: runRemove } = useMutation(
    (targetShipmentId: number) => ShipmentsService.remove(targetShipmentId),
    {
      onSuccess: () => {
        showSuccess(t('common:messages.deleteSuccess'));
        setPendingAction(null);
        navigate(UrlConstants.SHIPMENTS_URL);
      },
      onError: (message: string) => {
        showError(message);
      },
    },
  );

  const { mutateAsync: runChangeStatus } = useMutation(
    (targetShipmentId: number) =>
      ShipmentsService.changeStatus(targetShipmentId),
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
      void runRemove(shipmentId);
      return;
    }

    if (pendingAction === 'changeStatus') {
      void runChangeStatus(shipmentId);
    }
  }, [pendingAction, runChangeStatus, runRemove, shipmentId]);

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

  const columns: MRT_ColumnDef<ShipmentLine>[] = useShipmentLinesColumns(
    shipment
      ? getCurrencyName(shipment.currencyId)
      : CommonConstants.EMPTY_STRING,
  );
  const serviceColumns: MRT_ColumnDef<ShipmentServiceLine>[] =
    useShipmentServiceLinesColumns(
      shipment
        ? getCurrencyName(shipment.currencyId)
        : CommonConstants.EMPTY_STRING,
    );
  const shipmentLinesTableConfig: MRT_TableOptions<ShipmentLine> = useMemo(
    () => ({
      data: shipment?.shipmentLines || [],
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
    [shipment, columns],
  );
  const shipmentServiceLinesTableConfig: MRT_TableOptions<ShipmentServiceLine> =
    useMemo(
      () => ({
        data: shipment?.shipmentServiceLines || [],
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
      [shipment, serviceColumns],
    );

  return (
    <>
      {loading && <Spinner />}

      {!loading && error && (
        <h3>
          {t('common:messages.error')} {error}
        </h3>
      )}

      {!loading && !error && shipment && (
        <>
          <Card shadow='sm' p='md' radius='md' withBorder mb='xs' mt='6'>
            <Group justify='space-between' align='flex-start'>
              <Grid gutter='xs' align='flex-start' style={{ flex: 1 }}>
                <Grid.Col span={12}>
                  <Group justify='flex-start' wrap='nowrap' gap='2'>
                    {shipment.status ? (
                      <IconCircleFilled color='green' />
                    ) : (
                      <IconCircle color='grey' stroke={5} />
                    )}
                    <Text
                      size='lg'
                      fw={StylesConstants.HEAVY_FONT_WEIGHT}
                      ml='xs'
                    >
                      {t('documents:documents.shipment')}{' '}
                      {CommonConstants.NUMBER}
                      {shipment.id}
                    </Text>
                  </Group>
                </Grid.Col>

                <Grid.Col span={12}>
                  <Text size='sm' fw={StylesConstants.DEFAULT_FONT_WEIGHT}>
                    {t('documents:documents.expectedDate')}:{' '}
                    {new Date(shipment.expectedDate).toLocaleDateString(
                      'uk-UA',
                    )}
                  </Text>
                </Grid.Col>
              </Grid>
              <DocumentActions
                loading={mutationLoading}
                canEdit={!shipment.status}
                canDelete={!shipment.status}
                onEdit={() =>
                  navigate(`${UrlConstants.SHIPMENTS_URL}/${shipmentId}/edit`)
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
                to={`${UrlConstants.RECEIVES_URL}/new?shipmentId=${shipmentId}`}
              >
                {t('documents:documents.createReceive')}
              </Button>
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
                translationKey={{
                  primary: 'documents:documents.seller',
                  secondary: 'documents:documents.warehouse',
                }}
                baseValue={{
                  primary: getCompanyName(shipment.sellerId),
                  secondary: getWarehouseName(shipment.sellerWarehouseId),
                }}
              />
              <DocumentPageItem
                gridSpan={6}
                translationKey={{
                  primary: 'documents:documents.buyer',
                }}
                baseValue={{
                  primary: getCompanyName(shipment.buyerId),
                }}
              />
            </Grid>
          </Card>

          <Card shadow='sm' p='md' radius='md' withBorder mb='sm'>
            <Text fw={StylesConstants.HEAVY_FONT_WEIGHT} size='md' mb='5'>
              {t('documents:documents.payDelivery')}
            </Text>
            <Grid gutter='md' align='flex-start'>
              <DocumentLinkItem
                gridSpan={4}
                translationKey='documents:documents.byInvoice'
                value={{
                  label: `${shipment.invoice.invoiceNumber}`,
                  uri: `${UrlConstants.INVOICES_URL}/${shipment.invoice.id}`,
                }}
              />
              <DocumentPageItem
                gridSpan={4}
                translationKey={{
                  primary: 'documents:documents.incoterms',
                }}
                baseValue={{
                  primary: shipment.incoterms
                    ? [shipment.incoterms.name, shipment.transportPlace].join(
                        CommonConstants.COMA_SPACE,
                      )
                    : CommonConstants.EMPTY_STRING,
                }}
              />
              <DocumentPageItem
                gridSpan={4}
                translationKey={{
                  primary: 'documents:documents.transportAmount',
                }}
                baseValue={{
                  primary: `${shipment.transportAmount} ${getCurrencyName(shipment.currencyId)}`,
                }}
              />
            </Grid>
          </Card>

          {receives.length > 0 && (
            <Card shadow='sm' p='md' radius='md' withBorder mb='sm'>
              <Text fw={StylesConstants.HEAVY_FONT_WEIGHT} size='md' mb='5'>
                {t('common:nav.receives')}
              </Text>
              <Group gap='xs'>
                {receives.map(receive => (
                  <Button
                    key={receive.id}
                    variant='light'
                    size='xs'
                    component={Link}
                    to={`${UrlConstants.RECEIVES_URL}/${receive.id}`}
                  >
                    {t('documents:documents.receive')} {CommonConstants.NUMBER}
                    {receive.id}
                  </Button>
                ))}
              </Group>
            </Card>
          )}

          {shipment.shipmentLines && (
            <HoldingTable
              tableOptions={shipmentLinesTableConfig}
              title={t('documents:documents.goods')}
            />
          )}

          {shipment.shipmentServiceLines?.length > 0 && (
            <HoldingTable
              tableOptions={shipmentServiceLinesTableConfig}
              title={t('documents:documents.services')}
            />
          )}
        </>
      )}
    </>
  );
}
