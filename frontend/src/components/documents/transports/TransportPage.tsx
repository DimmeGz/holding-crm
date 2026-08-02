import { type ReactNode, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Grid, Group, Text } from '@mantine/core';
import { IconCircle, IconCircleFilled } from '@tabler/icons-react';
import type { MRT_ColumnDef, MRT_TableOptions } from 'mantine-react-table';
import { DocumentActions } from '@/components/documents/common/DocumentActions';
import { DocumentPageItem } from '@/components/documents/common/DocumentPageItem';
import { ConfirmActionModal } from '@/components/shared/ConfirmActionModal';
import { HoldingTable } from '@/components/shared/HoldingTable';
import { Spinner } from '@/components/shared/Spinner';
import { CommonConstants } from '@/constants/common.constants';
import { StylesConstants } from '@/constants/styles.constants';
import { UrlConstants } from '@/constants/url-constants';
import { showError, showSuccess } from '@/helpers/notifications.helpers';
import { useTransportLinesColumns } from '@/hooks/documents/table-columns/useTransportLinesColumns';
import { useTransportServiceLinesColumns } from '@/hooks/documents/table-columns/useTransportServiceLinesColumns';
import { useTransport } from '@/hooks/documents/useTransports';
import { useMutation } from '@/hooks/useMutation';
import { TransportService } from '@/services/documents/transports.service';
import { useLibsStore } from '@/stores/useLibsStore';
import type {
  TransportLine,
  TransportServiceLine,
} from '@/types/documents/transports.types';

type PendingAction = 'delete' | 'changeStatus' | null;

export function TransportPage(): ReactNode {
  const { t } = useTranslation(['common', 'documents']);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const transportId = Number(id);
  const { data: transport, loading, error, refetch } = useTransport(transportId);
  const getCompanyName = useLibsStore(s => s.getCompanyName);
  const getWarehouseName = useLibsStore(s => s.getWarehouseName);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);

  const { loading: mutationLoading, mutateAsync: runRemove } = useMutation(
    (targetTransportId: number) => TransportService.remove(targetTransportId),
    {
      onSuccess: () => {
        showSuccess(t('common:messages.deleteSuccess'));
        setPendingAction(null);
        navigate(UrlConstants.TRANSPORT_URL);
      },
      onError: (message: string) => {
        showError(message);
      },
    },
  );

  const { mutateAsync: runChangeStatus } = useMutation(
    (targetTransportId: number) =>
      TransportService.changeStatus(targetTransportId),
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
      void runRemove(transportId);
      return;
    }

    if (pendingAction === 'changeStatus') {
      void runChangeStatus(transportId);
    }
  }, [pendingAction, runChangeStatus, runRemove, transportId]);

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

  const goodsColumns: MRT_ColumnDef<TransportLine>[] =
    useTransportLinesColumns();
  const serviceColumns: MRT_ColumnDef<TransportServiceLine>[] =
    useTransportServiceLinesColumns();
  const goodsTableConfig: MRT_TableOptions<TransportLine> = useMemo(
    () => ({
      data: transport?.productTransportLines || [],
      columns: goodsColumns,
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
    [transport, goodsColumns],
  );
  const serviceTableConfig: MRT_TableOptions<TransportServiceLine> = useMemo(
    () => ({
      data: transport?.productTransportServiceLines || [],
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
    [transport, serviceColumns],
  );

  return (
    <>
      {loading && <Spinner />}

      {!loading && error && (
        <h3>
          {t('common:messages.error')} {error}
        </h3>
      )}

      {!loading && !error && transport && (
        <>
          <Card shadow='sm' p='md' radius='md' withBorder mb='xs' mt='6'>
            <Group justify='space-between' align='flex-start'>
              <Grid gutter='xs' align='flex-start' style={{ flex: 1 }}>
                <Grid.Col span={12}>
                  <Group justify='flex-start' wrap='nowrap' gap='2'>
                    {transport.status ? (
                      <IconCircleFilled color='green' />
                    ) : (
                      <IconCircle color='grey' stroke={5} />
                    )}
                    <Text
                      size='lg'
                      fw={StylesConstants.HEAVY_FONT_WEIGHT}
                      ml='xs'
                    >
                      {t('common:nav.transportations')}{' '}
                      {CommonConstants.NUMBER}
                      {transport.id}
                    </Text>
                  </Group>
                </Grid.Col>

                <Grid.Col span={12}>
                  <Text size='sm' fw={StylesConstants.DEFAULT_FONT_WEIGHT}>
                    {t('documents:documents.expectedDate')}:{' '}
                    {new Date(transport.expectedDate).toLocaleDateString(
                      'uk-UA',
                    )}
                  </Text>
                </Grid.Col>
              </Grid>
              <DocumentActions
                loading={mutationLoading}
                canEdit={!transport.status}
                canDelete={!transport.status}
                onEdit={() =>
                  navigate(`${UrlConstants.TRANSPORT_URL}/${transportId}/edit`)
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
                gridSpan={4}
                translationKey={{
                  primary: 'documents:documents.company',
                }}
                baseValue={{
                  primary: getCompanyName(transport.companyId),
                }}
              />
              <DocumentPageItem
                gridSpan={4}
                translationKey={{
                  primary: 'documents:documents.warehouseSender',
                }}
                baseValue={{
                  primary:
                    getWarehouseName(transport.warehouseSenderId) ??
                    CommonConstants.EMPTY_STRING,
                }}
              />
              <DocumentPageItem
                gridSpan={4}
                translationKey={{
                  primary: 'documents:documents.warehouseReceive',
                }}
                baseValue={{
                  primary:
                    getWarehouseName(transport.warehouseReceiveId) ??
                    CommonConstants.EMPTY_STRING,
                }}
              />
            </Grid>
          </Card>

          {transport.productTransportLines.length > 0 && (
            <HoldingTable
              tableOptions={goodsTableConfig}
              title={t('documents:documents.goods')}
            />
          )}

          {transport.productTransportServiceLines.length > 0 && (
            <HoldingTable
              tableOptions={serviceTableConfig}
              title={t('documents:documents.services')}
            />
          )}
        </>
      )}
    </>
  );
}
