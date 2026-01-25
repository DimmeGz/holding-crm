import { ContractRelatedDocuments } from './ContractRelatedDocuments';
import { type ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Card, Grid, Group, Text } from '@mantine/core';
import type { MRT_ColumnDef, MRT_TableOptions } from 'mantine-react-table';
import { IconCircle } from '@tabler/icons-react';
import { DocumentPageItem } from '@/components/documents/common/DocumentPageItem';
import { HoldingTable } from '@/components/shared/HoldingTable';
import { Spinner } from '@/components/shared/Spinner';
import { CommonConstants } from '@/constants/common.constants';
import { StylesConstants } from '@/constants/styles.constants';
import { useContractLinesColumns } from '@/hooks/documents/table-columns/useContractLinesColumns';
import { useContract } from '@/hooks/documents/useContracts';
import { useLibsStore } from '@/stores/useLibsStore';
import type { Contract, ContractLine } from '@/types/documents/contracts.types';

export function ContractPage(): ReactNode {
  const { t } = useTranslation(['common', 'documents']),
    { id } = useParams<{ id: string }>(),
    { data, loading, error } = useContract(Number(id)),
    getCompanyName: (id: number) => string = useLibsStore(
      s => s.getCompanyName,
    ),
    getCurrencyName: (id: number) => string = useLibsStore(
      s => s.getCurrencyName,
    ),
    contract: Contract | undefined = data?.contract,
    columns: MRT_ColumnDef<ContractLine>[] = useContractLinesColumns(
      contract
        ? getCurrencyName(contract.currencyId)
        : CommonConstants.EMPTY_STRING,
    ),
    contractLinesTableConfig: MRT_TableOptions<ContractLine> = useMemo(
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

  console.log('contract', data);

  return (
    <>
      {loading && <Spinner />}

      {!loading && error && <h3>Помилка завантаження даних: {error}</h3>}

      {!loading && !error && contract && (
        <>
          <Card shadow='sm' p='md' radius='md' withBorder mb='xs' mt='6'>
            <Grid gutter='xs' align='flex-start'>
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
                    {t('documents:documents.contract')} №{contract.name}
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
                    : t('documents:documents:perpetual')}
                </Text>
              </Grid.Col>
            </Grid>
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
                  primary: contract.incoterms?.name,
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

          {contract.contractLines && (
            <HoldingTable
              tableOptions={contractLinesTableConfig}
              title={t('documents:documents.goods')}
            />
          )}

          {data?.orders && <ContractRelatedDocuments orders={data.orders} />}
        </>
      )}
    </>
  );
}
