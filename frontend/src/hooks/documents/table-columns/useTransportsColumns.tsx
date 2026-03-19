import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { MRT_ColumnDef, MRT_Row } from 'mantine-react-table';
import { Text } from '@mantine/core';
import { CommonConstants } from '@/constants/common.constants';
import { UrlConstants } from '@/constants/url-constants';
import { useTableColumns } from '@/hooks/documents/table-columns/useTableColumns';
import type { UseTableColumns } from '@/types/documents/common-documents.types';
import type { GetTransportsDto } from '@/types/documents/transports.types';
import { useLibsStore } from '@/stores/useLibsStore';

export function useTransportsColumns(): MRT_ColumnDef<GetTransportsDto>[] {
  const { t } = useTranslation(['tables', 'documents', 'common']),
    commonColumns: UseTableColumns = useTableColumns(),
    getWarehouseName: (id: number) => string = useLibsStore(
      s => s.getWarehouseName,
    ),
    getCompanyName: (id: number) => string = useLibsStore(
      s => s.getCompanyName,
    );

  return useMemo(
    () => [
      {
        header: CommonConstants.NUMBER,
        id: 'id',
        size: 100,
        Cell: ({ row }: { row: MRT_Row<GetTransportsDto> }) => (
          <Text
            component='a'
            href={`${UrlConstants.TRANSPORT_URL}/${row.original.id}`}
            td='underline'
            style={{ cursor: 'pointer' }}
          >
            {row.original.id}
          </Text>
        ),
      },
      {
        header: t('documents:documents.company'),
        id: 'company',
        size: 180,
        accessorFn: (row: GetTransportsDto) =>
          getCompanyName(row.companyId),
      },
      {
        header: t('documents:documents.warehouseSender'),
        id: 'warehouseSender',
        size: 200,
        accessorFn: (row: GetTransportsDto) =>
          getWarehouseName(row.warehouseSenderId),
      },
      {
        header: t('documents:documents.warehouseReceive'),
        id: 'warehouseReceive',
        size: 200,
        accessorFn: (row: GetTransportsDto) =>
          getWarehouseName(row.warehouseReceiveId),
      },
      commonColumns.date<GetTransportsDto>(),
      commonColumns.status<GetTransportsDto>(),
    ],
    [commonColumns, t, getCompanyName, getWarehouseName],
  );
}

