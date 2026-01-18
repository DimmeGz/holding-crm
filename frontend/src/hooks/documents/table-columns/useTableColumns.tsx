import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import type { MRT_ColumnDef } from 'mantine-react-table';
import { IconCheck, IconX } from '@tabler/icons-react';
import { CommonConstants } from '@/constants/common.constants';
import type { UseTableColumns } from '@/types/documents/common-documents.types';

export function useTableColumns(): UseTableColumns {
  const { t } = useTranslation(['tables']);

  return {
    seller: <T extends { seller: { name: string } }>(): MRT_ColumnDef<T> => ({
      header: t('tables:columns.seller'),
      accessorFn: (row: T) => row.seller.name,
      id: 'sellerName',
    }),
    buyer: <T extends { buyer: { name: string } }>(): MRT_ColumnDef<T> => ({
      header: t('tables:columns.buyer'),
      accessorFn: (row: T) => row.buyer.name,
      id: 'buyerName',
    }),
    recipient: <
      T extends { recipient: { name: string } },
    >(): MRT_ColumnDef<T> => ({
      header: t('tables:columns.recipient'),
      accessorFn: (row: T) => row.recipient?.name,
      id: 'recipientName',
    }),
    date: <T extends { expectedDate?: Date }>(): MRT_ColumnDef<T> => ({
      header: t('tables:columns.expectedDate'),
      accessorFn: (row: T): string =>
        row.expectedDate
          ? new Date(row.expectedDate).toLocaleDateString('uk-UA')
          : CommonConstants.EMPTY_STRING,
      id: 'expectedDate',
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
    }),
    amount: <
      T extends { documentSum: number; currency: { name: string } },
    >(): MRT_ColumnDef<T> => ({
      header: t('tables:columns.confirmDate'),
      accessorFn: (row: T): string => `${row.documentSum} ${row.currency.name}`,
      id: 'amount',
    }),
    byContract: <
      T extends { contract: { name: string } },
    >(): MRT_ColumnDef<T> => ({
      header: t('tables:columns.byContract'),
      accessorFn: (row: T) => row.contract.name,
      id: 'contractName',
    }),
    status: <T extends { status: boolean }>(): MRT_ColumnDef<T> => ({
      header: t('tables:columns.status'),
      accessorFn: (row: T): ReactNode =>
        row.status ? <IconCheck /> : <IconX />,
      id: 'status',
    }),
  };
}
