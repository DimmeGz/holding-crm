import { type ReactNode, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Grid, Group, Text } from '@mantine/core';
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
import { useProduction } from '@/hooks/documents/useProductions';
import { useProductionInLinesColumns } from '@/hooks/documents/table-columns/useProductionInLinesColumns';
import { useProductionOutLinesColumns } from '@/hooks/documents/table-columns/useProductionOutLinesColumns';
import { useMutation } from '@/hooks/useMutation';
import { ProductionsService } from '@/services/documents/productions.service';
import { useLibsStore } from '@/stores/useLibsStore';
import type {
  ProductionInLine,
  ProductionOutLine,
} from '@/types/documents/productions.types';

type PendingAction = 'delete' | 'changeStatus' | null;

export function ProductionPage(): ReactNode {
  const { t } = useTranslation(['common', 'documents', 'tables']);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const productionId = Number(id);
  const { data: production, loading, error, refetch } =
    useProduction(productionId);
  const getCompanyName = useLibsStore(s => s.getCompanyName);
  const getWarehouseName = useLibsStore(s => s.getWarehouseName);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);

  const { loading: mutationLoading, mutateAsync: runRemove } = useMutation(
    (targetProductionId: number) =>
      ProductionsService.remove(targetProductionId),
    {
      onSuccess: () => {
        showSuccess(t('common:messages.deleteSuccess'));
        setPendingAction(null);
        navigate(UrlConstants.PRODUCTION_URL);
      },
      onError: (message: string) => {
        showError(message);
      },
    },
  );

  const { mutateAsync: runChangeStatus } = useMutation(
    (targetProductionId: number) =>
      ProductionsService.changeStatus(targetProductionId),
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
      void runRemove(productionId);
      return;
    }

    if (pendingAction === 'changeStatus') {
      void runChangeStatus(productionId);
    }
  }, [pendingAction, productionId, runChangeStatus, runRemove]);

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

  const outColumns: MRT_ColumnDef<ProductionOutLine>[] =
    useProductionOutLinesColumns();
  const inColumns: MRT_ColumnDef<ProductionInLine>[] =
    useProductionInLinesColumns();
  const outLinesTableConfig: MRT_TableOptions<ProductionOutLine> = useMemo(
    () => ({
      data: production?.productionOutLines || [],
      columns: outColumns,
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
    [production, outColumns],
  );
  const inLinesTableConfig: MRT_TableOptions<ProductionInLine> = useMemo(
    () => ({
      data: production?.productionInLines || [],
      columns: inColumns,
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
    [production, inColumns],
  );

  return (
    <>
      {loading && <Spinner />}

      {!loading && error && (
        <h3>
          {t('common:messages.error')} {error}
        </h3>
      )}

      {!loading && !error && production && (
        <>
          <Card shadow='sm' p='md' radius='md' withBorder mb='xs' mt='6'>
            <Group justify='space-between' align='flex-start'>
              <Grid gutter='xs' align='flex-start' style={{ flex: 1 }}>
                <Grid.Col span={12}>
                  <Group justify='flex-start' wrap='nowrap' gap='2'>
                    {production.status ? (
                      <IconCircleFilled color='green' />
                    ) : (
                      <IconCircle color='grey' stroke={5} />
                    )}
                    <Text
                      size='lg'
                      fw={StylesConstants.HEAVY_FONT_WEIGHT}
                      ml='xs'
                    >
                      {t('common:nav.production')}{' '}
                      {CommonConstants.NUMBER}
                      {production.id}
                    </Text>
                  </Group>
                </Grid.Col>

                <Grid.Col span={12}>
                  <Text size='sm' fw={StylesConstants.DEFAULT_FONT_WEIGHT}>
                    {t('tables:columns.expectedDate')}:{' '}
                    {new Date(production.expectedDate).toLocaleDateString(
                      'uk-UA',
                    )}
                  </Text>
                </Grid.Col>
              </Grid>
              <DocumentActions
                loading={mutationLoading}
                canEdit={!production.status}
                canDelete={!production.status}
                onEdit={() =>
                  navigate(
                    `${UrlConstants.PRODUCTION_URL}/${productionId}/edit`,
                  )
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
                translationKey={{ primary: 'documents:documents.company' }}
                baseValue={{
                  primary:
                    production.company?.name ||
                    getCompanyName(production.companyId),
                }}
              />
              <DocumentPageItem
                gridSpan={6}
                translationKey={{ primary: 'documents:documents.warehouse' }}
                baseValue={{
                  primary:
                    production.warehouse?.name ||
                    getWarehouseName(production.warehouseId) ||
                    CommonConstants.EMPTY_STRING,
                }}
              />
            </Grid>
          </Card>

          {production.productionOutLines?.length > 0 && (
            <HoldingTable
              tableOptions={outLinesTableConfig}
              title={t('documents:documents.productionOut')}
            />
          )}

          {production.productionInLines?.length > 0 && (
            <HoldingTable
              tableOptions={inLinesTableConfig}
              title={t('documents:documents.productionIn')}
            />
          )}
        </>
      )}
    </>
  );
}
