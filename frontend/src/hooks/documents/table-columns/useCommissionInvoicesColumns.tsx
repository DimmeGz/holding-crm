import { Fragment, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from '@mantine/core';
import type { MRT_ColumnDef, MRT_Row } from 'mantine-react-table';
import { InvoiceLink } from '@/components/documents/invoices/InvoiceLink';
import { CommonConstants } from '@/constants/common.constants';
import { UrlConstants } from '@/constants/url-constants';
import { useTableColumns } from '@/hooks/documents/table-columns/useTableColumns';
import type { GetCommissionInvoicesDto } from '@/types/documents/commission-invoices.types';
import type { UseTableColumns } from '@/types/documents/common-documents.types';

export function useCommissionInvoicesColumns(): MRT_ColumnDef<GetCommissionInvoicesDto>[] {
  const { t } = useTranslation(['tables', 'documents']),
    commonColumns: UseTableColumns = useTableColumns();

  return useMemo(
    () => [
      {
        header: CommonConstants.NUMBER,
        id: 'commissionInvoiceNumber',
        Cell: ({ row }: { row: MRT_Row<GetCommissionInvoicesDto> }) => (
          <Text
            component='a'
            href={`${UrlConstants.COMMISSION_INVOICES_URL}/${row.original.id}`}
            td='underline'
            style={{ cursor: 'pointer' }}
          >
            {row.original.id}
          </Text>
        ),
      },
      commonColumns.seller<GetCommissionInvoicesDto>(),
      commonColumns.buyer<GetCommissionInvoicesDto>(),
      commonColumns.status<GetCommissionInvoicesDto>(),
      {
        header: t('tables:columns.rate'),
        accessorFn: (row: GetCommissionInvoicesDto): string =>
          row.rate + CommonConstants.PERCENT,
        id: 'rate',
      },
      commonColumns.amount<GetCommissionInvoicesDto>(),
      {
        header: t('tables:columns.byInvoice'),
        id: 'byInvoice',
        Cell: ({ row }: { row: MRT_Row<GetCommissionInvoicesDto> }) => (
          <>
            <InvoiceLink invoice={row.original.invoice} />
            {row.original.invoice.children.length > 0 && (
              <>
                {' / '}
                {row.original.invoice.children.map((invoice, index) => (
                  <Fragment key={invoice.id}>
                    {index > 0 && CommonConstants.COMA_SPACE}
                    <InvoiceLink invoice={invoice} />
                  </Fragment>
                ))}
              </>
            )}
          </>
        ),
      },
    ],
    [commonColumns, t],
  );
}
