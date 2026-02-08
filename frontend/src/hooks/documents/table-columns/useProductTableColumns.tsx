import { useTranslation } from 'react-i18next';
import type { MRT_Cell, MRT_ColumnDef } from 'mantine-react-table';
import { useLibsStore } from '@/stores/useLibsStore';
import type { UseProductTableColumns } from '@/types/documents/common-documents.types';

export function useProductTableColumns(
  currency: string,
): UseProductTableColumns {
  const { t } = useTranslation(['common', 'tables']),
    getProductName: (id: number) => string = useLibsStore(
      s => s.getProductName,
    ),
    getPackageName: (id: number) => string = useLibsStore(
      s => s.getPackageName,
    );

  return {
    product: <T extends { productId: number }>(): MRT_ColumnDef<T> => ({
      header: t('tables:columns.product'),
      accessorFn: (row: T) => getProductName(row.productId),
      id: 'productMan',
      size: 150,
    }),
    package: <T extends { packageId: number }>(): MRT_ColumnDef<T> => ({
      header: t('tables:columns.package'),
      accessorFn: (row: T) => getPackageName(row.packageId),
      id: 'package',
      size: 100,
    }),
    qty: <T extends { qty: number }>(): MRT_ColumnDef<T> => ({
      header: t('tables:columns.qty'),
      accessorKey: 'qty',
      id: 'qty',
      size: 100,
      Cell: ({ cell }: { cell: MRT_Cell<T> }) =>
        `${cell.getValue<number>()} ${t('common:common.kg')}`,
    }),
    price: <T extends { price: number }>(): MRT_ColumnDef<T> => ({
      header: t('tables:columns.price'),
      accessorKey: 'price',
      id: 'price',
      size: 100,
      Cell: ({ cell }: { cell: MRT_Cell<T> }) =>
        `${cell.getValue<number>()} ${currency}`,
    }),
    amount: <T extends { price: number; qty: number }>(): MRT_ColumnDef<T> => ({
      header: t('tables:columns.amount'),
      accessorFn: (row: T) => row.price * row.qty,
      id: 'amount',
      size: 100,
      Cell: ({ cell }: { cell: MRT_Cell<T> }) =>
        `${cell.getValue<number>()} ${currency}`,
    }),
  };
}
