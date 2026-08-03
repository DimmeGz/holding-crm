import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Text } from '@mantine/core';
import type { MRT_ColumnDef, MRT_Row } from 'mantine-react-table';
import { CommonConstants } from '@/constants/common.constants';
import { UrlConstants } from '@/constants/url-constants';
import type { ReportProductionLine } from '@/types/warehouse/warehouse.types';

function formatDate(value?: Date | string | null): string {
  return value
    ? new Date(value).toLocaleDateString('uk-UA')
    : CommonConstants.EMPTY_STRING;
}

export function useReportProductionColumns(options?: {
  linkProduct?: boolean;
  linkBatch?: boolean;
  showDate?: boolean;
}): MRT_ColumnDef<ReportProductionLine>[] {
  const { t } = useTranslation(['tables', 'documents', 'common']);
  const linkProduct = options?.linkProduct ?? true;
  const linkBatch = options?.linkBatch ?? true;
  const showDate = options?.showDate ?? true;

  return useMemo(() => {
    const columns: MRT_ColumnDef<ReportProductionLine>[] = [
      {
        header: CommonConstants.NUMBER,
        id: 'rowNumber',
        size: 50,
        Cell: ({ row }: { row: MRT_Row<ReportProductionLine> }) =>
          row.index + 1,
      },
      {
        header: t('common:nav.production'),
        id: 'production',
        size: 160,
        Cell: ({ row }: { row: MRT_Row<ReportProductionLine> }) => {
          const production = row.original.production;
          if (!production?.id) {
            return CommonConstants.EMPTY_STRING;
          }

          return (
            <Text
              component={Link}
              to={`${UrlConstants.PRODUCTION_URL}/${production.id}`}
              td='underline'
            >
              {t('common:nav.production')} {CommonConstants.NUMBER}
              {production.id}
            </Text>
          );
        },
      },
      {
        header: t('tables:columns.product'),
        id: 'product',
        size: 140,
        accessorFn: (row: ReportProductionLine): string =>
          row.product?.name ?? CommonConstants.EMPTY_STRING,
        Cell: ({ row }: { row: MRT_Row<ReportProductionLine> }) => {
          const product = row.original.product;
          if (!product?.id) {
            return CommonConstants.EMPTY_STRING;
          }

          if (!linkProduct) {
            return product.name;
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
        size: 120,
        accessorFn: (row: ReportProductionLine): string =>
          row.batch?.name ?? CommonConstants.EMPTY_STRING,
        Cell: ({ row }: { row: MRT_Row<ReportProductionLine> }) => {
          const batch = row.original.batch;
          if (!batch?.id) {
            return CommonConstants.EMPTY_STRING;
          }

          if (!linkBatch) {
            return batch.name;
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
        header: t('tables:columns.qty'),
        id: 'qty',
        size: 90,
        accessorFn: (row: ReportProductionLine): number => row.qty,
      },
      {
        header: t('documents:documents.company'),
        id: 'company',
        size: 150,
        accessorFn: (row: ReportProductionLine): string =>
          row.production?.company?.name ?? CommonConstants.EMPTY_STRING,
      },
    ];

    if (showDate) {
      columns.push({
        header: t('tables:columns.expectedDate'),
        id: 'expectedDate',
        size: 110,
        accessorFn: (row: ReportProductionLine): string =>
          formatDate(row.production?.expectedDate),
      });
    }

    return columns;
  }, [linkBatch, linkProduct, showDate, t]);
}
