import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router-dom';
import { Text } from '@mantine/core';
import type { MRT_ColumnDef, MRT_Row } from 'mantine-react-table';
import { CommonConstants } from '@/constants/common.constants';
import { UrlConstants } from '@/constants/url-constants';
import type { GetWarehouseAccountingDto } from '@/types/warehouse/warehouse.types';

function buildFilterUrl(
  currentParams: URLSearchParams,
  key: 'company' | 'warehouse',
  value: number,
): string {
  const next = new URLSearchParams(currentParams);
  next.set(key, String(value));
  const search = next.toString();
  return search
    ? `${UrlConstants.WAREHOUSE_URL}?${search}`
    : UrlConstants.WAREHOUSE_URL;
}

export function useWarehouseColumns(): MRT_ColumnDef<GetWarehouseAccountingDto>[] {
  const { t } = useTranslation(['tables', 'documents', 'common']);
  const [searchParams] = useSearchParams();

  return useMemo(
    () => [
      {
        header: CommonConstants.NUMBER,
        id: 'rowNumber',
        size: 60,
        Cell: ({ row }: { row: MRT_Row<GetWarehouseAccountingDto> }) =>
          row.index + 1,
      },
      {
        header: t('tables:columns.product'),
        id: 'product',
        size: 180,
        accessorFn: (row: GetWarehouseAccountingDto): string =>
          row.batch?.product?.name ?? CommonConstants.EMPTY_STRING,
        Cell: ({ row }: { row: MRT_Row<GetWarehouseAccountingDto> }) => {
          const product = row.original.batch?.product;
          if (!product?.id) {
            return CommonConstants.EMPTY_STRING;
          }

          return (
            <Text
              component={Link}
              to={`${UrlConstants.PRODUCT_REPORT_URL}/${product.id}`}
              td='underline'
            >
              {product.name}
            </Text>
          );
        },
      },
      {
        header: t('tables:columns.batch'),
        id: 'batch',
        size: 140,
        accessorFn: (row: GetWarehouseAccountingDto): string =>
          row.batch?.name ?? CommonConstants.EMPTY_STRING,
        Cell: ({ row }: { row: MRT_Row<GetWarehouseAccountingDto> }) => {
          const batch = row.original.batch;
          if (!batch?.id) {
            return CommonConstants.EMPTY_STRING;
          }

          return (
            <Text
              component={Link}
              to={`${UrlConstants.BATCH_REPORT_URL}/${batch.id}`}
              td='underline'
            >
              {batch.name}
            </Text>
          );
        },
      },
      {
        header: t('tables:columns.package'),
        id: 'package',
        size: 120,
        accessorFn: (row: GetWarehouseAccountingDto): string =>
          row.package?.name ?? CommonConstants.EMPTY_STRING,
      },
      {
        header: t('documents:documents.warehouse'),
        id: 'warehouse',
        size: 140,
        accessorFn: (row: GetWarehouseAccountingDto): string =>
          row.warehouse?.name ?? CommonConstants.EMPTY_STRING,
        Cell: ({ row }: { row: MRT_Row<GetWarehouseAccountingDto> }) => {
          const warehouse = row.original.warehouse;
          if (!warehouse?.id) {
            return CommonConstants.EMPTY_STRING;
          }

          return (
            <Text
              component={Link}
              to={buildFilterUrl(searchParams, 'warehouse', warehouse.id)}
              td='underline'
            >
              {warehouse.name}
            </Text>
          );
        },
      },
      {
        header: t('documents:documents.company'),
        id: 'company',
        size: 160,
        accessorFn: (row: GetWarehouseAccountingDto): string =>
          row.company?.name ?? CommonConstants.EMPTY_STRING,
        Cell: ({ row }: { row: MRT_Row<GetWarehouseAccountingDto> }) => {
          const company = row.original.company;
          if (!company?.id) {
            return CommonConstants.EMPTY_STRING;
          }

          return (
            <Text
              component={Link}
              to={`${UrlConstants.WAREHOUSE_URL}?company=${company.id}`}
              td='underline'
            >
              {company.name}
            </Text>
          );
        },
      },
      {
        header: t('tables:columns.qty'),
        id: 'qty',
        size: 100,
        accessorFn: (row: GetWarehouseAccountingDto): number => row.qty,
      },
      {
        header: t('tables:columns.cost'),
        id: 'cost',
        size: 140,
        accessorFn: (row: GetWarehouseAccountingDto): string => {
          const currency = row.currency?.name ?? CommonConstants.EMPTY_STRING;
          return `${row.cost} ${currency}`.trim();
        },
      },
      {
        header: t('tables:columns.totalCost'),
        id: 'totalCost',
        size: 160,
        accessorFn: (row: GetWarehouseAccountingDto): string => {
          const total = row.qty * row.cost;
          const currency = row.currency?.name ?? CommonConstants.EMPTY_STRING;
          return `${total.toFixed(2)} ${currency}`.trim();
        },
      },
    ],
    [searchParams, t],
  );
}
