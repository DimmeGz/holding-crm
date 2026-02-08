import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import type { MRT_ColumnDef } from 'mantine-react-table';
import { IconCheck, IconX } from '@tabler/icons-react';
import { CommonConstants } from '@/constants/common.constants';
import { useLibsStore } from '@/stores/useLibsStore';
import type { UseTableColumns } from '@/types/documents/common-documents.types';

export function useTableColumns(): UseTableColumns {
  const { t } = useTranslation(['tables']),
    getCompanyName: (id: number) => string = useLibsStore(
      s => s.getCompanyName,
    ),
    getCurrencyName: (id: number) => string = useLibsStore(
      s => s.getCurrencyName,
    );

  return {
    seller: <T extends { sellerId: number }>(
      columnName?: string,
    ): MRT_ColumnDef<T> => ({
      header: columnName || t('tables:columns.seller'),
      accessorFn: (row: T) => getCompanyName(row.sellerId),
      id: 'sellerName',
      size: 150,
    }),
    buyer: <T extends { buyerId: number }>(
      columnName?: string,
    ): MRT_ColumnDef<T> => ({
      header: columnName || t('tables:columns.buyer'),
      accessorFn: (row: T) => getCompanyName(row.buyerId),
      id: 'buyerName',
      size: 150,
    }),
    recipient: <T extends { recipientId?: number }>(): MRT_ColumnDef<T> => ({
      header: t('tables:columns.recipient'),
      accessorFn: (row: T) =>
        row.recipientId
          ? getCompanyName(row.recipientId)
          : CommonConstants.EMPTY_STRING,
      id: 'recipientName',
      size: 150,
    }),
    date: <T extends { expectedDate?: Date }>(
      columnName?: string,
    ): MRT_ColumnDef<T> => ({
      header: columnName || t('tables:columns.expectedDate'),
      accessorFn: (row: T): string =>
        row.expectedDate
          ? new Date(row.expectedDate).toLocaleDateString('uk-UA')
          : CommonConstants.EMPTY_STRING,
      id: 'expectedDate',
      size: 100,
    }),
    confirmDate: <
      T extends { confirmExpectedDate?: Date },
    >(): MRT_ColumnDef<T> => ({
      header: t('tables:columns.confirmDate'),
      accessorFn: (row: T): string =>
        row.confirmExpectedDate
          ? new Date(row.confirmExpectedDate).toLocaleDateString('uk-UA')
          : CommonConstants.EMPTY_STRING,
      id: 'confirmExpectedDate',
      size: 100,
    }),
    amount: <
      T extends { documentSum: number; currencyId: number },
    >(): MRT_ColumnDef<T> => ({
      header: t('tables:columns.amount'),
      accessorFn: (row: T): string =>
        `${row.documentSum} ${getCurrencyName(row.currencyId)}`,
      id: 'amount',
      size: 100,
    }),
    status: <T extends { status: boolean }>(): MRT_ColumnDef<T> => ({
      header: t('tables:columns.status'),
      accessorFn: (row: T): ReactNode =>
        row.status ? <IconCheck /> : <IconX />,
      id: 'status',
      size: 100,
    }),
  };
}
