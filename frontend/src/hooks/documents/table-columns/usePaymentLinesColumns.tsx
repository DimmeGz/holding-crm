import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { MRT_Cell, MRT_ColumnDef, MRT_Row } from 'mantine-react-table';
import { InvoiceLink } from '@/components/documents/invoices/InvoiceLink';
import type { PaymentLine } from '@/types/documents/payments.types';

export function usePaymentLinesColumns(
  currency: string,
): MRT_ColumnDef<PaymentLine>[] {
  const { t } = useTranslation(['common', 'documents', 'tables']);

  return useMemo(
    () => [
      {
        header: t('tables:columns.byInvoice'),
        id: 'byInvoice',
        Cell: ({ row }: { row: MRT_Row<PaymentLine> }) => (
          <InvoiceLink invoice={row.original.invoice} />
        ),
      },
      {
        header: t('tables:columns.amount'),
        accessorKey: 'amount',
        id: 'amount',
        Cell: ({ cell }: { cell: MRT_Cell<PaymentLine> }) =>
          `${cell.getValue<number>()} ${currency}`,
      },
    ],
    [t, currency],
  );
}
