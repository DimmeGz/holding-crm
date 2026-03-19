import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from '@mantine/core';
import type { MRT_ColumnDef, MRT_Row } from 'mantine-react-table';
import { CommonConstants } from '@/constants/common.constants';
import { UrlConstants } from '@/constants/url-constants';
import type {
  CommissionPaymentLine,
} from '@/types/documents/commission-payments.types';
import { useTableColumns } from './useTableColumns';
import type { UseTableColumns } from '@/types/documents/common-documents.types';

export function useCommissionPaymentLinesColumns(
  currency: string,
): MRT_ColumnDef<CommissionPaymentLine>[] {
  const { t } = useTranslation(['tables', 'documents']),
    commonColumns: UseTableColumns = useTableColumns();

  return useMemo(
    () => [
      {
        header: CommonConstants.NUMBER,
        id: 'commissionInvoiceId',
        size: 130,
        Cell: ({ row }: { row: MRT_Row<CommissionPaymentLine> }) => (
          <Text
            component='a'
            href={`${UrlConstants.COMMISSION_INVOICES_URL}/${row.original.commissionInvoiceId}`}
            td='underline'
            style={{ cursor: 'pointer' }}
          >
            {t('documents:documents.commissionInvoice') + ` ${CommonConstants.NUMBER} ${row.original.commissionInvoiceId}`}
          </Text>
        ),
      },
      {
        header: t('tables:columns.amount'),
        id: 'amount',
        accessorFn: (row: CommissionPaymentLine): string =>
          `${row.amount} ${currency || CommonConstants.EMPTY_STRING}`,
      },
    ],
    [commonColumns, t, currency],
  );
}

