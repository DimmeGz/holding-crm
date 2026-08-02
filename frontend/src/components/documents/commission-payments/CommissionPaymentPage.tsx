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
import { useCommissionPaymentLinesColumns } from '@/hooks/documents/table-columns/useCommissionPaymentLinesColumns';
import { useCommissionPayment } from '@/hooks/documents/useCommissionPayments';
import { useMutation } from '@/hooks/useMutation';
import { CommissionPaymentsService } from '@/services/documents/commission-payments.service';
import { useLibsStore } from '@/stores/useLibsStore';
import type { CommissionPaymentLine } from '@/types/documents/commission-payments.types';

type PendingAction = 'delete' | 'changeStatus' | null;

export function CommissionPaymentPage(): ReactNode {
  const { t } = useTranslation(['common', 'documents']);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const commissionPaymentId = Number(id);
  const {
    data: commissionPayment,
    loading,
    error,
    refetch,
  } = useCommissionPayment(commissionPaymentId);
  const getCompanyName = useLibsStore(s => s.getCompanyName);
  const getCurrencyName = useLibsStore(s => s.getCurrencyName);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);

  const { loading: mutationLoading, mutateAsync: runRemove } = useMutation(
    (targetId: number) => CommissionPaymentsService.remove(targetId),
    {
      onSuccess: () => {
        showSuccess(t('common:messages.deleteSuccess'));
        setPendingAction(null);
        navigate(UrlConstants.COMMISSION_PAYMENTS_URL);
      },
      onError: (message: string) => {
        showError(message);
      },
    },
  );

  const { mutateAsync: runChangeStatus } = useMutation(
    (targetId: number) => CommissionPaymentsService.changeStatus(targetId),
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
      void runRemove(commissionPaymentId);
      return;
    }

    if (pendingAction === 'changeStatus') {
      void runChangeStatus(commissionPaymentId);
    }
  }, [commissionPaymentId, pendingAction, runChangeStatus, runRemove]);

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

  const currency = commissionPayment
    ? getCurrencyName(commissionPayment.currencyId)
    : CommonConstants.EMPTY_STRING;
  const columns: MRT_ColumnDef<CommissionPaymentLine>[] =
    useCommissionPaymentLinesColumns(currency);
  const commissionPaymentLinesTableConfig: MRT_TableOptions<CommissionPaymentLine> =
    useMemo(
      () => ({
        data: commissionPayment?.commissionPaymentLines || [],
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
      [commissionPayment, columns],
    );

  return (
    <>
      {loading && <Spinner />}

      {!loading && error && (
        <h3>
          {t('common:messages.error')} {error}
        </h3>
      )}

      {!loading && !error && commissionPayment && (
        <>
          <Card shadow='sm' p='md' radius='md' withBorder mb='xs' mt='6'>
            <Group justify='space-between' align='flex-start'>
              <Grid gutter='xs' align='flex-start' style={{ flex: 1 }}>
                <Grid.Col span={12}>
                  <Group justify='flex-start' wrap='nowrap' gap='2'>
                    {commissionPayment.status ? (
                      <IconCircleFilled color='green' />
                    ) : (
                      <IconCircle color='grey' stroke={5} />
                    )}
                    <Text
                      size='lg'
                      fw={StylesConstants.HEAVY_FONT_WEIGHT}
                      ml='xs'
                    >
                      {t('documents:documents.commissionPayment')}{' '}
                      {CommonConstants.NUMBER}
                      {commissionPayment.id}
                    </Text>
                  </Group>
                </Grid.Col>

                <Grid.Col span={12}>
                  <Text size='sm' fw={StylesConstants.DEFAULT_FONT_WEIGHT}>
                    {t('tables:columns.paymentDate')}:{' '}
                    {new Date(commissionPayment.expectedDate).toLocaleDateString(
                      'uk-UA',
                    )}
                  </Text>
                </Grid.Col>
              </Grid>
              <DocumentActions
                loading={mutationLoading}
                canEdit={!commissionPayment.status}
                canDelete={!commissionPayment.status}
                onEdit={() =>
                  navigate(
                    `${UrlConstants.COMMISSION_PAYMENTS_URL}/${commissionPaymentId}/edit`,
                  )
                }
                onDelete={() => setPendingAction('delete')}
                onChangeStatus={() => setPendingAction('changeStatus')}
              />
            </Group>
          </Card>

          <Card shadow='sm' p='md' radius='md' withBorder mb='sm'>
            <Text fw={StylesConstants.HEAVY_FONT_WEIGHT} size='md' mb='5'>
              {t('documents:documents.mainInfo')}
            </Text>
            <Grid gutter='md' align='flex-start'>
              <DocumentPageItem
                gridSpan={6}
                translationKey={{
                  primary: 'documents:documents.payer',
                }}
                baseValue={{
                  primary: getCompanyName(commissionPayment.buyerId),
                }}
              />
              <DocumentPageItem
                gridSpan={6}
                translationKey={{
                  primary: 'documents:documents.recipient',
                }}
                baseValue={{
                  primary: getCompanyName(commissionPayment.sellerId),
                }}
              />
            </Grid>
          </Card>

          {commissionPayment.commissionPaymentLines &&
            commissionPayment.commissionPaymentLines.length > 0 && (
              <HoldingTable
                tableOptions={commissionPaymentLinesTableConfig}
                title={t('common:nav.commissionInvoices')}
              />
            )}
        </>
      )}

      {confirmModalProps && (
        <ConfirmActionModal
          opened={pendingAction !== null}
          onClose={() => setPendingAction(null)}
          onConfirm={handleConfirm}
          loading={mutationLoading}
          {...confirmModalProps}
        />
      )}
    </>
  );
}
