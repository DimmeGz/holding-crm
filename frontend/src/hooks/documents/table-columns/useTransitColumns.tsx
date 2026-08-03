import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from '@mantine/core';
import type { MRT_ColumnDef, MRT_Row } from 'mantine-react-table';
import { CommonConstants } from '@/constants/common.constants';
import { UrlConstants } from '@/constants/url-constants';
import type { GetTransitLineDto } from '@/types/documents/transit.types';

function formatDate(value?: Date | string | null): string {
  return value
    ? new Date(value).toLocaleDateString('uk-UA')
    : CommonConstants.EMPTY_STRING;
}

export function useTransitColumns(): MRT_ColumnDef<GetTransitLineDto>[] {
  const { t } = useTranslation(['tables', 'documents', 'common']);

  return useMemo(
    () => [
      {
        header: t('tables:columns.seller'),
        id: 'seller',
        accessorFn: (row: GetTransitLineDto): string =>
          row.shipment?.seller?.name ?? CommonConstants.EMPTY_STRING,
        size: 150,
      },
      {
        header: t('tables:columns.recipient'),
        id: 'buyer',
        accessorFn: (row: GetTransitLineDto): string =>
          row.shipment?.buyer?.name ?? CommonConstants.EMPTY_STRING,
        size: 150,
      },
      {
        header: t('documents:documents.shipment'),
        id: 'shipment',
        size: 100,
        Cell: ({ row }: { row: MRT_Row<GetTransitLineDto> }) => {
          const shipmentId = row.original.shipment?.id;
          if (!shipmentId) {
            return CommonConstants.EMPTY_STRING;
          }

          return (
            <Text
              component='a'
              href={`${UrlConstants.SHIPMENTS_URL}/${shipmentId}`}
              td='underline'
              style={{ cursor: 'pointer' }}
            >
              {shipmentId}
            </Text>
          );
        },
      },
      {
        header: t('tables:columns.shipmentExpectedDate'),
        id: 'shipmentExpectedDate',
        accessorFn: (row: GetTransitLineDto): string =>
          formatDate(row.shipment?.expectedDate),
        size: 120,
      },
      {
        header: t('tables:columns.product'),
        id: 'product',
        accessorFn: (row: GetTransitLineDto): string =>
          row.batch?.product?.name ?? CommonConstants.EMPTY_STRING,
        size: 150,
      },
      {
        header: t('tables:columns.batch'),
        id: 'batch',
        accessorFn: (row: GetTransitLineDto): string =>
          row.batch?.name ?? CommonConstants.EMPTY_STRING,
        size: 120,
      },
      {
        header: t('tables:columns.package'),
        id: 'package',
        accessorFn: (row: GetTransitLineDto): string =>
          row.package?.name ?? CommonConstants.EMPTY_STRING,
        size: 100,
      },
      {
        header: t('tables:columns.qty'),
        id: 'qty',
        accessorFn: (row: GetTransitLineDto): number => row.qty,
        size: 100,
        Cell: ({ row }: { row: MRT_Row<GetTransitLineDto> }) =>
          `${row.original.qty} ${t('common:common.kg')}`,
      },
      {
        header: t('tables:columns.plannedReceive'),
        id: 'receive',
        size: 120,
        Cell: ({ row }: { row: MRT_Row<GetTransitLineDto> }) => {
          const receiveId = row.original.receive?.id;
          if (!receiveId) {
            return CommonConstants.EMPTY_VALUE_PLACEHOLDER;
          }

          return (
            <Text
              component='a'
              href={`${UrlConstants.RECEIVES_URL}/${receiveId}`}
              td='underline'
              style={{ cursor: 'pointer' }}
            >
              {receiveId}
            </Text>
          );
        },
      },
      {
        header: t('tables:columns.receiveExpectedDate'),
        id: 'receiveExpectedDate',
        accessorFn: (row: GetTransitLineDto): string =>
          formatDate(row.receive?.expectedDate),
        size: 140,
        Cell: ({ row }: { row: MRT_Row<GetTransitLineDto> }) => {
          const formatted = formatDate(row.original.receive?.expectedDate);
          return formatted || CommonConstants.EMPTY_VALUE_PLACEHOLDER;
        },
      },
    ],
    [t],
  );
}
