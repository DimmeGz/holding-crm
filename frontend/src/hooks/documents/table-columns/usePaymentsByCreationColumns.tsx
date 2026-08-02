import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from '@mantine/core';
import type { MRT_ColumnDef, MRT_Row } from 'mantine-react-table';
import { CommonConstants } from '@/constants/common.constants';
import { UrlConstants } from '@/constants/url-constants';
import { useTableColumns } from '@/hooks/documents/table-columns/useTableColumns';
import type { UseTableColumns } from '@/types/documents/common-documents.types';
import type { GetPaymentsDto } from '@/types/documents/payments.types';

export function usePaymentsByCreationColumns(): MRT_ColumnDef<GetPaymentsDto>[] {
  const { t } = useTranslation(['tables', 'documents']),
    commonColumns: UseTableColumns = useTableColumns();

  return useMemo(
    () => [
      {
        header: CommonConstants.NUMBER,
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
      {
        header: t('documents:documents.createdAt'),
        id: 'createdAt',
        Cell: ({ row }: { row: MRT_Row<GetPaymentsDto> }) =>
          row.original.createdAt
            ? new Date(row.original.createdAt).toLocaleString('uk-UA')
            : CommonConstants.EMPTY_STRING,
      },
      commonColumns.buyer<GetPaymentsDto>(t('tables:columns.payer')),
      commonColumns.seller<GetPaymentsDto>(t('tables:columns.recipient')),
      commonColumns.status<GetPaymentsDto>(),
      commonColumns.amount<GetPaymentsDto>(),
      commonColumns.date<GetPaymentsDto>(t('tables:columns.paymentDate')),
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
