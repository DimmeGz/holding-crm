import { type ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Card, Grid, Group, Text } from '@mantine/core';
import type { MRT_ColumnDef, MRT_TableOptions } from 'mantine-react-table';
import { IconCircle, IconCircleFilled } from '@tabler/icons-react';
import { DocumentLinkItem } from '@/components/documents/common/DocumentLinkItem';
import { DocumentPageItem } from '@/components/documents/common/DocumentPageItem';
import { HoldingTable } from '@/components/shared/HoldingTable';
import { Spinner } from '@/components/shared/Spinner';
import { CommonConstants } from '@/constants/common.constants';
import { StylesConstants } from '@/constants/styles.constants';
import { useShipment } from '@/hooks/documents/useShipments';
import { useLibsStore } from '@/stores/useLibsStore';
import type {
  Shipment,
  ShipmentLine,
} from '@/types/documents/shipments.types';
import { UrlConstants } from '@/constants/url-constants';

export function ShipmentPage(): ReactNode {
  const { t } = useTranslation(['common', 'documents']),
    { id } = useParams<{ id: string }>(),
    { data, loading, error } = useShipment(Number(id)),
    getCompanyName: (id: number) => string = useLibsStore(
      s => s.getCompanyName,
    ),
    getWarehouseName: (id: number) => string = useLibsStore(
      s => s.getWarehouseName,
    ),
    getCurrencyName: (id: number) => string = useLibsStore(
      s => s.getCurrencyName,
    ),
    shipment: Shipment | undefined = data?.shipment,
    columns: MRT_ColumnDef<ShipmentLine>[] = [],
    shipmentLinesTableConfig: MRT_TableOptions<ShipmentLine> = useMemo(
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

  console.log('shipment', shipment);

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
            <Grid gutter='xs' align='flex-start'>
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
                    {t('documents:documents.shipment')} {CommonConstants.NUMBER}
                    {shipment.id}
                  </Text>
                </Group>
              </Grid.Col>

              <Grid.Col span={12}>
                <Text size='sm' fw={StylesConstants.DEFAULT_FONT_WEIGHT}>
                  {t('documents:documents.expectedDate')}:{' '}
                  {new Date(shipment.expectedDate).toLocaleDateString('uk-UA')}
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

          {shipment.shipmentLines && (
            <HoldingTable
              tableOptions={shipmentLinesTableConfig}
              title={t('documents:documents.goods')}
            />
          )}
        </>
      )}
    </>
  );
}

