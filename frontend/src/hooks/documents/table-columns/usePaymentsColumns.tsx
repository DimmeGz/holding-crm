import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from '@mantine/core';
import type { MRT_ColumnDef, MRT_Row } from 'mantine-react-table';
import { CommonConstants } from '@/constants/common.constants';
import { UrlConstants } from '@/constants/url-constants';
import { useTableColumns } from '@/hooks/documents/table-columns/useTableColumns';
import type { UseTableColumns } from '@/types/documents/common-documents.types';
import type { GetPaymentsDto } from '@/types/documents/payments.types';

export function usePaymentsColumns(): MRT_ColumnDef<GetPaymentsDto>[] {
  const { t } = useTranslation(['tables', 'documents']),
    commonColumns: UseTableColumns = useTableColumns();

  return useMemo(
    () => [
      {
        header: '№',
        id: 'id',
        size: 100,
        Cell: ({ row }: { row: MRT_Row<GetPaymentsDto> }) => (
          <Text
            component='a'
            href={`${UrlConstants.PAYMENTS_URL}/${row.original.id}`}
            td='underline'
            style={{ cursor: 'pointer' }}
          >
            {row.original.id}
          </Text>
        ),
      },
      commonColumns.buyer<GetPaymentsDto>(t('tables:columns.payer')),
      commonColumns.seller<GetPaymentsDto>(t('tables:columns.recipient')),
      commonColumns.status<GetPaymentsDto>(),
      commonColumns.date<GetPaymentsDto>(t('tables:columns.paymentDate')),
      commonColumns.amount<GetPaymentsDto>(),
      {
        header: t('tables:columns.byInvoice'),
        id: 'byInvoice',
        Cell: ({ row }: { row: MRT_Row<GetPaymentsDto> }) => (
          <>
            {row.original.paymentLines
              .map(paymentLine => paymentLine.invoice.invoiceNumber)
              .join(CommonConstants.COMA_SPACE)}
          </>
        ),
      },
    ],
    [commonColumns, t],
  );
}
