import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Card, Grid, Group, Text } from '@mantine/core';
import { IconCircle, IconCircleFilled } from '@tabler/icons-react';
import type { MRT_ColumnDef, MRT_TableOptions } from 'mantine-react-table';

import { DocumentPageItem } from '@/components/documents/common/DocumentPageItem';
import { HoldingTable } from '@/components/shared/HoldingTable';
import { Spinner } from '@/components/shared/Spinner';
import { CommonConstants } from '@/constants/common.constants';
import { StylesConstants } from '@/constants/styles.constants';
import { useTransportLinesColumns } from '@/hooks/documents/table-columns/useTransportLinesColumns';
import { useTransportServiceLinesColumns } from '@/hooks/documents/table-columns/useTransportServiceLinesColumns';
import { useTransport } from '@/hooks/documents/useTransports';
import type {
  TransportLine,
  TransportServiceLine,
} from '@/types/documents/transports.types';

export function TransportPage(): ReactNode {
  const { t } = useTranslation(['common', 'documents']),
    { id } = useParams<{ id: string }>(),
    { data: transport, loading, error } = useTransport(Number(id)),
    goodsColumns: MRT_ColumnDef<TransportLine>[] =
      useTransportLinesColumns(),
    serviceColumns: MRT_ColumnDef<TransportServiceLine>[] =
      useTransportServiceLinesColumns(),
    goodsTableConfig: MRT_TableOptions<TransportLine> = useMemo(
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
    ),
    serviceTableConfig: MRT_TableOptions<TransportServiceLine> =
      useMemo(
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
            <Grid gutter='xs' align='flex-start'>
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
          </Card>

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
                  primary: transport.company?.name ?? CommonConstants.EMPTY_STRING,
                }}
              />
              <DocumentPageItem
                gridSpan={4}
                translationKey={{
                  primary: 'documents:documents.warehouseSender',
                }}
                baseValue={{
                  primary:
                    transport.warehouseSender?.name ??
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
                    transport.warehouseReceive?.name ??
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

