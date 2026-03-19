import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from '@mantine/core';
import type { MRT_ColumnDef, MRT_Row } from 'mantine-react-table';
import { CommonConstants } from '@/constants/common.constants';
import { UrlConstants } from '@/constants/url-constants';
import { useTableColumns } from '@/hooks/documents/table-columns/useTableColumns';
import type { UseTableColumns } from '@/types/documents/common-documents.types';
import type { GetCommissionPaymentsDto } from '@/types/documents/commission-payments.types';
import { useLibsStore } from '@/stores/useLibsStore';

export function useCommissionPaymentsColumns(): MRT_ColumnDef<GetCommissionPaymentsDto>[] {
  const { t } = useTranslation(['tables', 'documents']),
    getCurrencyName: (id: number) => string = useLibsStore(
      s => s.getCurrencyName,
    ),
    commonColumns: UseTableColumns = useTableColumns();

  return useMemo(
    () => [
      {
        header: CommonConstants.NUMBER,
        id: 'id',
        size: 100,
        Cell: ({ row }: { row: MRT_Row<GetCommissionPaymentsDto> }) => (
          <Text
            component='a'
            href={`${UrlConstants.COMMISSION_PAYMENTS_URL}/${row.original.id}`}
            td='underline'
            style={{ cursor: 'pointer' }}
          >
            {row.original.id}
          </Text>
        ),
      },
      commonColumns.buyer<GetCommissionPaymentsDto>(t('tables:columns.payer')),
      commonColumns.seller<GetCommissionPaymentsDto>(
        t('tables:columns.recipient'),
      ),
      commonColumns.status<GetCommissionPaymentsDto>(),
      {
        header: t('documents:documents.byInvoice'),
        accessorFn: (row: GetCommissionPaymentsDto): string =>
          `${row.commissionPaymentLines.map(line => line.commissionInvoiceId).join(CommonConstants.COMA_SPACE)}`,
        id: 'byInvoice',
      },
      {
        header: t('tables:columns.amount'),
        accessorFn: (row: GetCommissionPaymentsDto): string =>
          `${row.totalAmount} ${row.currencyId ? getCurrencyName(row.currencyId) : CommonConstants.EMPTY_STRING}`,
        id: 'amount',
      },
      commonColumns.date<GetCommissionPaymentsDto>(
        t('tables:columns.paymentDate'),
      ),
    ],
    [commonColumns, t],
  );
}

