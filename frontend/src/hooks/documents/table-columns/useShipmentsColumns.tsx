import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from '@mantine/core';
import type { MRT_ColumnDef, MRT_Row } from 'mantine-react-table';
import { CommonConstants } from '@/constants/common.constants';
import { UrlConstants } from '@/constants/url-constants';
import { useTableColumns } from '@/hooks/documents/table-columns/useTableColumns';
import type { UseTableColumns } from '@/types/documents/common-documents.types';
import type { GetShipmentsDto } from '@/types/documents/shipments.types';

export function useShipmentsColumns(): MRT_ColumnDef<GetShipmentsDto>[] {
  const { t } = useTranslation(['tables', 'documents']),
    commonColumns: UseTableColumns = useTableColumns();

  return useMemo(
    () => [
      {
        header: CommonConstants.NUMBER,
        id: 'id',
        size: 100,
        Cell: ({ row }: { row: MRT_Row<GetShipmentsDto> }) => (
          <Text
            component='a'
            href={`${UrlConstants.SHIPMENTS_URL}/${row.original.id}`}
            td='underline'
            style={{ cursor: 'pointer' }}
          >
            {row.original.id}
          </Text>
        ),
      },
      commonColumns.seller<GetShipmentsDto>(),
      commonColumns.buyer<GetShipmentsDto>(),
      commonColumns.date<GetShipmentsDto>(),
      commonColumns.status<GetShipmentsDto>(),
      commonColumns.amount<GetShipmentsDto>(),
      {
        header: t('tables:columns.byInvoice'),
        id: 'byInvoice',
        Cell: ({ row }: { row: MRT_Row<GetShipmentsDto> }) => (
          <>
            {row.original.invoice.invoiceNumber}
          </>
        ),
      },
    ],
    [commonColumns, t],
  );
}

