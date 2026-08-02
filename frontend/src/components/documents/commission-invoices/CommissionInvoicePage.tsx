import { DocumentLinkItem } from '../common/DocumentLinkItem';
import { DocumentPageItem } from '../common/DocumentPageItem';
import { type ReactNode, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Card, Grid, Group, Text } from '@mantine/core';
import { IconCircle, IconCircleFilled } from '@tabler/icons-react';
import { DocumentActions } from '@/components/documents/common/DocumentActions';
import { ConfirmActionModal } from '@/components/shared/ConfirmActionModal';
import { Spinner } from '@/components/shared/Spinner';
import { CommonConstants } from '@/constants/common.constants';
import { StylesConstants } from '@/constants/styles.constants';
import { UrlConstants } from '@/constants/url-constants';
import { showError, showSuccess } from '@/helpers/notifications.helpers';
import { useCommissionInvoice } from '@/hooks/documents/useCommissionInvoices';
import { useMutation } from '@/hooks/useMutation';
import { CommissionInvoicesService } from '@/services/documents/commission-invoices.service';
import { useLibsStore } from '@/stores/useLibsStore';

type PendingAction = 'delete' | 'changeStatus' | null;

export function CommissionInvoicePage(): ReactNode {
  const { t } = useTranslation(['common', 'documents', 'tables']);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const commissionInvoiceId = Number(id);
  const {
    data: commissionInvoice,
    loading,
    error,
    refetch,
  } = useCommissionInvoice(commissionInvoiceId);
  const getCompanyName = useLibsStore(s => s.getCompanyName);
  const getCurrencyName = useLibsStore(s => s.getCurrencyName);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);

  const { loading: mutationLoading, mutateAsync: runRemove } = useMutation(
    (targetId: number) => CommissionInvoicesService.remove(targetId),
    {
      onSuccess: () => {
        showSuccess(t('common:messages.deleteSuccess'));
        setPendingAction(null);
        navigate(UrlConstants.COMMISSION_INVOICES_URL);
      },
      onError: (message: string) => {
        showError(message);
      },
    },
  );

  const { mutateAsync: runChangeStatus } = useMutation(
    (targetId: number) => CommissionInvoicesService.changeStatus(targetId),
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
      void runRemove(commissionInvoiceId);
      return;
    }

    if (pendingAction === 'changeStatus') {
      void runChangeStatus(commissionInvoiceId);
    }
  }, [commissionInvoiceId, pendingAction, runChangeStatus, runRemove]);

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

  return (
    <>
      {loading && <Spinner />}

      {!loading && error && (
        <h3>
          {t('common:messages.error')} {error}
        </h3>
      )}

      {!loading && !error && commissionInvoice && (
        <>
          <Card shadow='sm' p='md' radius='md' withBorder mb='xs' mt='6'>
            <Group justify='space-between' align='flex-start'>
              <Grid gutter='xs' align='flex-start' style={{ flex: 1 }}>
                <Grid.Col span={12}>
                  <Group justify='flex-start' wrap='nowrap' gap='2'>
                    {commissionInvoice.status ? (
                      <IconCircleFilled color='green' />
                    ) : (
                      <IconCircle color='grey' stroke={5} />
                    )}
                    <Text
                      size='lg'
                      fw={StylesConstants.HEAVY_FONT_WEIGHT}
                      ml='xs'
                    >
                      {t('documents:documents.commissionInvoice')}{' '}
                      {CommonConstants.NUMBER}
                      {commissionInvoice.id}
                    </Text>
                  </Group>
                </Grid.Col>

                <Grid.Col span={4}>
                  <Text size='sm' fw={StylesConstants.DEFAULT_FONT_WEIGHT}>
                    {t('documents:documents.createdAt')}:{' '}
                    {new Date(
                      commissionInvoice.creationDate,
                    ).toLocaleDateString('uk-UA')}
                  </Text>
                </Grid.Col>
              </Grid>
              <DocumentActions
                loading={mutationLoading}
                canEdit={!commissionInvoice.status}
                canDelete={!commissionInvoice.status}
                onEdit={() =>
                  navigate(
                    `${UrlConstants.COMMISSION_INVOICES_URL}/${commissionInvoiceId}/edit`,
                  )
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
                to={`${UrlConstants.COMMISSION_PAYMENTS_URL}/new?commissionInvoiceIds=${commissionInvoiceId}`}
              >
                {t('documents:documents.createCommissionPayment')}
              </Button>
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
                  primary: getCompanyName(commissionInvoice.buyerId),
                }}
              />
              <DocumentPageItem
                gridSpan={6}
                translationKey={{
                  primary: 'documents:documents.recipient',
                }}
                baseValue={{
                  primary: getCompanyName(commissionInvoice.sellerId),
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
                gridSpan={6}
                translationKey='documents:documents.byInvoice'
                value={{
                  label: `${commissionInvoice.invoice.invoiceNumber}`,
                  uri: `${UrlConstants.INVOICES_URL}/${commissionInvoice.invoice.id}`,
                }}
              />
              <DocumentLinkItem
                gridSpan={6}
                translationKey='documents:documents.subordinateInvoices'
                value={commissionInvoice.invoice.children.map(child => ({
                  label: `${child.invoiceNumber}`,
                  uri: `${UrlConstants.INVOICES_URL}/${child.id}`,
                }))}
              />
              <DocumentPageItem
                gridSpan={4}
                translationKey={{
                  primary: 'tables:columns.amount',
                }}
                baseValue={{
                  primary: `${commissionInvoice.documentSum} ${getCurrencyName(commissionInvoice.currencyId)}`,
                }}
              />
            </Grid>
          </Card>
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
