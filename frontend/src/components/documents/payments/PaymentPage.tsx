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
import { usePaymentLinesColumns } from '@/hooks/documents/table-columns/usePaymentLinesColumns';
import { usePayment } from '@/hooks/documents/usePayments';
import { useMutation } from '@/hooks/useMutation';
import { PaymentsService } from '@/services/documents/payments.service';
import { useLibsStore } from '@/stores/useLibsStore';
import type { Payment, PaymentLine } from '@/types/documents/payments.types';

type PendingAction = 'delete' | 'changeStatus' | null;

export function PaymentPage(): ReactNode {
  const { t } = useTranslation(['common', 'documents']);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const paymentId = Number(id);
  const { data, loading, error, refetch } = usePayment(paymentId);
  const getCompanyName = useLibsStore(s => s.getCompanyName);
  const getCurrencyName = useLibsStore(s => s.getCurrencyName);
  const payment: Payment | undefined = data?.payment;
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);

  const { loading: mutationLoading, mutateAsync: runRemove } = useMutation(
    (targetPaymentId: number) => PaymentsService.remove(targetPaymentId),
    {
      onSuccess: () => {
        showSuccess(t('common:messages.deleteSuccess'));
        setPendingAction(null);
        navigate(UrlConstants.PAYMENTS_URL);
      },
      onError: (message: string) => {
        showError(message);
      },
    },
  );

  const { mutateAsync: runChangeStatus } = useMutation(
    (targetPaymentId: number) => PaymentsService.changeStatus(targetPaymentId),
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
      void runRemove(paymentId);
      return;
    }

    if (pendingAction === 'changeStatus') {
      void runChangeStatus(paymentId);
    }
  }, [paymentId, pendingAction, runChangeStatus, runRemove]);

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

  const columns: MRT_ColumnDef<PaymentLine>[] = usePaymentLinesColumns(
    payment ? getCurrencyName(payment.currencyId) : CommonConstants.EMPTY_STRING,
  );
  const paymentLinesTableConfig: MRT_TableOptions<PaymentLine> = useMemo(
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
            <Group justify='space-between' align='flex-start'>
              <Grid gutter='xs' align='flex-start' style={{ flex: 1 }}>
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
                      {t('documents:documents.payment')} {CommonConstants.NUMBER}
                      {payment.id}
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
              <DocumentActions
                loading={mutationLoading}
                canEdit={!payment.status}
                canDelete={!payment.status}
                onEdit={() =>
                  navigate(`${UrlConstants.PAYMENTS_URL}/${paymentId}/edit`)
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
