import { type ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Card, Grid, Group, Text } from '@mantine/core';
import { IconCircle, IconCircleFilled } from '@tabler/icons-react';
import type { MRT_ColumnDef, MRT_TableOptions } from 'mantine-react-table';
import { HoldingTable } from '@/components/shared/HoldingTable';
import { Spinner } from '@/components/shared/Spinner';
import { DocumentPageItem } from '@/components/documents/common/DocumentPageItem';
import { DocumentLinkItem } from '@/components/documents/common/DocumentLinkItem';
import { CommonConstants } from '@/constants/common.constants';
import { StylesConstants } from '@/constants/styles.constants';
import { UrlConstants } from '@/constants/url-constants';
import { useLibsStore } from '@/stores/useLibsStore';
import { useReceive } from '@/hooks/documents/useReceives';
import { useReceiveLinesColumns } from '@/hooks/documents/table-columns/useReceiveLinesColumns';
import type { ReceiveLine } from '@/types/documents/receives.types';

export function ReceivePage(): ReactNode {
  const { t } = useTranslation(['common', 'documents']),
    { id } = useParams<{ id: string }>(),
    { data: receive, loading, error } = useReceive(Number(id)),
    getCompanyName: (companyId: number) => string = useLibsStore(
      s => s.getCompanyName,
    ),
    getWarehouseName: (warehouseId: number) => string = useLibsStore(
      s => s.getWarehouseName,
    ),
    getCurrencyName: (currencyId: number) => string = useLibsStore(
      s => s.getCurrencyName,
    ),
    currencyName: string = receive
      ? getCurrencyName(receive.currencyId)
      : CommonConstants.EMPTY_STRING,
    columns: MRT_ColumnDef<ReceiveLine>[] = useReceiveLinesColumns(
      currencyName,
    ),
    receiveLinesTableConfig: MRT_TableOptions<ReceiveLine> = useMemo(
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
            <Grid gutter='xs' align='flex-start'>
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
          </Card>

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
                translationKey={{ primary: 'documents:documents.transportAmount' }}
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
        </>
      )}
    </>
  );
}
