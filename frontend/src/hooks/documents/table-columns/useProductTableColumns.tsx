import { useTranslation } from 'react-i18next';
import type { MRT_Cell, MRT_ColumnDef } from 'mantine-react-table';
import { useLibsStore } from '@/stores/useLibsStore';
import type { UseProductTableColumns } from '@/types/documents/common-documents.types';

export function useProductTableColumns(
  currency: string,
): UseProductTableColumns {
  const { t } = useTranslation(['tables']),
    getProductName: (id: number) => string = useLibsStore(
      s => s.getProductName,
    ),
    getPackageName: (id: number) => string = useLibsStore(
      s => s.getPackageName,
    );

  return {
    product: <T extends { productId: number }>(): MRT_ColumnDef<T> => ({
      header: t('tables:columns.productMan'),
      accessorFn: (row: T) => getProductName(row.productId),
      id: 'productMan',
    }),
    package: <T extends { packageId: number }>(): MRT_ColumnDef<T> => ({
      header: t('tables:columns.package'),
      accessorFn: (row: T) => getPackageName(row.packageId),
      id: 'package',
    }),
    qty: <T extends { qty: number }>(): MRT_ColumnDef<T> => ({
      header: t('tables:columns.qty'),
      accessorKey: 'qty',
      id: 'qty',
      Cell: ({ cell }: { cell: MRT_Cell<T> }) =>
        `${cell.getValue<number>()} ${t('tables:columns.kg')}`,
    }),
    price: <T extends { price: number }>(): MRT_ColumnDef<T> => ({
      header: t('tables:columns.price'),
      accessorKey: 'price',
      id: 'price',
      Cell: ({ cell }: { cell: MRT_Cell<T> }) =>
        `${cell.getValue<number>()} ${currency}`,
    }),
    amount: <T extends { price: number; qty: number }>(): MRT_ColumnDef<T> => ({
      header: t('tables:columns.amount'),
      accessorFn: (row: T) => row.price * row.qty,
      id: 'amount',
      Cell: ({ cell }: { cell: MRT_Cell<T> }) =>
        `${cell.getValue<number>()} ${currency}`,
    }),
  };
}
