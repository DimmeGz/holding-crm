import {
  type ReactNode,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Card, Grid, Group, Text } from '@mantine/core';
import type { MRT_ColumnDef, MRT_TableOptions } from 'mantine-react-table';
import { IconCircle } from '@tabler/icons-react';
import { DocumentActions } from '@/components/documents/common/DocumentActions';
import { DocumentPageItem } from '@/components/documents/common/DocumentPageItem';
import { ContractRelatedDocuments } from '@/components/documents/contracts/ContractRelatedDocuments';
import { ConfirmActionModal } from '@/components/shared/ConfirmActionModal';
import { HoldingTable } from '@/components/shared/HoldingTable';
import { Spinner } from '@/components/shared/Spinner';
import { CommonConstants } from '@/constants/common.constants';
import { StylesConstants } from '@/constants/styles.constants';
import { UrlConstants } from '@/constants/url-constants';
import { transformContractRelatedDocumentsToTreeData } from '@/helpers/related-documents.helpers';
import { showError, showSuccess } from '@/helpers/notifications.helpers';
import { useContractLinesColumns } from '@/hooks/documents/table-columns/useContractLinesColumns';
import { useContractServiceLinesColumns } from '@/hooks/documents/table-columns/useContractServiceLinesColumns';
import { useContract } from '@/hooks/documents/useContracts';
import { useMutation } from '@/hooks/useMutation';
import { ContractsService } from '@/services/documents/contracts.service';
import { useLibsStore } from '@/stores/useLibsStore';
import type {
  Contract,
  ContractLine,
  ContractServiceLine,
} from '@/types/documents/contracts.types';

type PendingAction = 'delete' | 'changeStatus' | null;

export function ContractPage(): ReactNode {
  const { t } = useTranslation(['common', 'documents']);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const contractId = Number(id);
  const { data, loading, error, refetch } = useContract(contractId);
  const getCompanyName = useLibsStore(s => s.getCompanyName);
  const getCurrencyName = useLibsStore(s => s.getCurrencyName);
  const getIncotermsName = useLibsStore(s => s.getIncotermsName);
  const contract: Contract | undefined = data?.contract;
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);

  const currencyName = contract
    ? getCurrencyName(contract.currencyId)
    : CommonConstants.EMPTY_STRING;

  const columns: MRT_ColumnDef<ContractLine>[] =
    useContractLinesColumns(currencyName);
  const serviceColumns: MRT_ColumnDef<ContractServiceLine>[] =
    useContractServiceLinesColumns(currencyName);

  const contractLinesTableConfig: MRT_TableOptions<ContractLine> = useMemo(
    () => ({
      data: contract?.contractLines || [],
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
        mb: 'xs',
      },
    }),
    [contract, columns],
  );

  const serviceLinesTableConfig: MRT_TableOptions<ContractServiceLine> =
    useMemo(
      () => ({
        data: contract?.contractServiceLines || [],
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
          mb: 'xs',
        },
      }),
      [contract, serviceColumns],
    );

  const { loading: mutationLoading, mutate: runRemove } = useMutation(
    (targetContractId: number) => ContractsService.remove(targetContractId),
    {
      onSuccess: () => {
        showSuccess(t('common:messages.deleteSuccess'));
        setPendingAction(null);
        navigate(UrlConstants.CONTRACTS_URL);
      },
      onError: (message: string) => {
        showError(message);
      },
    },
  );

  const { mutate: runChangeStatus } = useMutation(
    (targetContractId: number) =>
      ContractsService.changeStatus(targetContractId),
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
      runRemove(contractId);
      return;
    }

    if (pendingAction === 'changeStatus') {
      runChangeStatus(contractId);
    }
  }, [contractId, pendingAction, runChangeStatus, runRemove]);

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

  const incotermsDisplay = contract?.incoterms?.name
    ? [contract.incoterms.name, contract.transportPlace]
        .filter(Boolean)
        .join(CommonConstants.COMA_SPACE)
    : contract?.incotermsId
      ? getIncotermsName(contract.incotermsId)
      : CommonConstants.EMPTY_STRING;

  return (
    <>
      {loading && <Spinner />}

      {!loading && error && (
        <h3>
          {t('common:messages.error')} {error}
        </h3>
      )}

      {!loading && !error && contract && (
        <>
          <Card shadow='sm' p='md' radius='md' withBorder mb='xs' mt='6'>
            <Group justify='space-between' align='flex-start' mb='xs'>
              <Grid gutter='xs' align='flex-start' style={{ flex: 1 }}>
                <Grid.Col span={12}>
                  <Group justify='flex-start' wrap='nowrap' gap='2'>
                    {contract.status ? (
                      <IconCircle color='grey' stroke={5} />
                    ) : (
                      <IconCircle color='green' stroke={5} />
                    )}
                    <Text
                      size='lg'
                      fw={StylesConstants.HEAVY_FONT_WEIGHT}
                      ml='xs'
                    >
                      {t('documents:documents.contract')} {CommonConstants.NUMBER}
                      {contract.name}
                    </Text>
                    {contract.status && (
                      <Text
                        size='lg'
                        fw={StylesConstants.HEAVY_FONT_WEIGHT}
                        ml='xs'
                        c='dimmed'
                      >
                        ({t('documents:documents.closed').toLocaleLowerCase()})
                      </Text>
                    )}
                  </Group>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Text size='sm' fw={StylesConstants.DEFAULT_FONT_WEIGHT}>
                    {t('documents:documents.createdAt')}:{' '}
                    {new Date(contract.signatureDate).toLocaleDateString('uk-UA')}
                  </Text>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Text size='sm' fw={StylesConstants.DEFAULT_FONT_WEIGHT}>
                    {t('tables:columns.expirationDate')}:{' '}
                    {contract.term
                      ? new Date(contract.term).toLocaleDateString('uk-UA')
                      : t('documents:documents.perpetual')}
                  </Text>
                </Grid.Col>
              </Grid>
              <DocumentActions
                loading={mutationLoading}
                canEdit={!contract.status}
                onEdit={() =>
                  navigate(`${UrlConstants.CONTRACTS_URL}/${contractId}/edit`)
                }
                onDelete={() => setPendingAction('delete')}
                onChangeStatus={() => setPendingAction('changeStatus')}
              />
            </Group>
            <Group justify='flex-end'>
              <Button
                variant='light'
                size='xs'
                component={Link}
                to={`${UrlConstants.CONTRACTS_URL}/new?parentId=${contractId}`}
              >
                {t('documents:documents.createSubContract')}
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
                }}
                baseValue={{
                  primary: getCompanyName(contract.sellerId),
                }}
              />
              <DocumentPageItem
                gridSpan={6}
                translationKey={{
                  primary: 'documents:documents.buyer',
                }}
                baseValue={{
                  primary: getCompanyName(contract.buyerId),
                }}
              />
              <DocumentPageItem
                gridSpan={4}
                translationKey={{
                  primary: 'documents:documents.currency',
                }}
                baseValue={{
                  primary: currencyName,
                }}
              />
              {contract.parentId && (
                <DocumentPageItem
                  gridSpan={4}
                  translationKey={{
                    primary: 'documents:documents.parentContract',
                  }}
                  baseValue={{
                    primary: `#${contract.parentId}`,
                  }}
                />
              )}
              {contract.comment && (
                <DocumentPageItem
                  gridSpan={contract.parentId ? 4 : 8}
                  translationKey={{
                    primary: 'documents:documents.comment',
                  }}
                  baseValue={{
                    primary: contract.comment,
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
                  primary: `${contract.vat} %`,
                }}
              />
              <DocumentPageItem
                gridSpan={3}
                translationKey={{
                  primary: 'documents:documents.paymentDelay',
                }}
                baseValue={{
                  primary: `${contract.paymentDelay} ${t('documents:documents.days')}`,
                }}
              />
              <DocumentPageItem
                gridSpan={3}
                translationKey={{
                  primary: 'documents:documents.incoterms',
                }}
                baseValue={{
                  primary: incotermsDisplay,
                }}
              />
              <DocumentPageItem
                gridSpan={3}
                translationKey={{
                  primary: 'documents:documents.orderPrefix',
                }}
                baseValue={{
                  primary: contract.orderPrefix,
                }}
              />
            </Grid>
          </Card>

          {contract.contractLines?.length > 0 && (
            <HoldingTable
              tableOptions={contractLinesTableConfig}
              title={t('documents:documents.goods')}
            />
          )}

          {contract.contractServiceLines &&
            contract.contractServiceLines.length > 0 && (
              <HoldingTable
                tableOptions={serviceLinesTableConfig}
                title={t('documents:documents.services')}
              />
            )}

          {data?.orders && (
            <ContractRelatedDocuments
              orders={transformContractRelatedDocumentsToTreeData(
                data.orders,
                t,
              )}
            />
          )}
        </>
      )}
    </>
  );
}
