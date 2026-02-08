import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { MRT_ColumnDef, MRT_Row } from 'mantine-react-table';
import { InvoiceLink } from '@/components/documents/invoices/InvoiceLink';
import { CommonConstants } from '@/constants/common.constants';
import { useTableColumns } from '@/hooks/documents/table-columns/useTableColumns';
import type { UseTableColumns } from '@/types/documents/common-documents.types';
import type { GetInvoicesDto } from '@/types/documents/invoices.types';

export function useInvoicesColumns(): MRT_ColumnDef<GetInvoicesDto>[] {
  const { t } = useTranslation(['tables', 'documents']),
    commonColumns: UseTableColumns = useTableColumns();

  return useMemo(
    () => [
      {
        header: CommonConstants.NUMBER,
        id: 'invoiceNumber',
        Cell: ({ row }: { row: MRT_Row<GetInvoicesDto> }) => (
          <InvoiceLink invoice={row.original} />
        ),
      },
      commonColumns.date<GetInvoicesDto>(),
      commonColumns.seller<GetInvoicesDto>(),
      commonColumns.buyer<GetInvoicesDto>(),
      commonColumns.recipient<GetInvoicesDto>(),
      {
        header: t('tables:columns.status'),
        accessorFn: (row: GetInvoicesDto): string =>
          row.status
            ? t('documents:documents.payed')
            : t('documents:documents.invoiced'),
        id: 'status',
      },
      commonColumns.amount<GetInvoicesDto>(),
      {
        header: t('documents:documents.byInvoice'),
        id: 'invoiceParent',
        Cell: ({ row }: { row: MRT_Row<GetInvoicesDto> }) =>
          row.original.parent && <InvoiceLink invoice={row.original.parent} />,
      },
    ],
    [commonColumns, t],
  );
}
