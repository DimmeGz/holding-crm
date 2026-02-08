import type { MRT_ColumnDef } from 'mantine-react-table';

export type UseTableColumns = {
  seller: <
    T extends {
      sellerId: number;
    },
  >() => MRT_ColumnDef<T>;
  buyer: <
    T extends {
      buyerId: number;
    },
  >() => MRT_ColumnDef<T>;
  recipient: <
    T extends {
      recipientId: number;
    },
  >() => MRT_ColumnDef<T>;
  date: <
    T extends {
      expectedDate?: Date;
    },
  >() => MRT_ColumnDef<T>;
  confirmDate: <
    T extends {
      confirmExpectedDate?: Date;
    },
  >() => MRT_ColumnDef<T>;
  amount: <
    T extends {
      documentSum: number;
      currencyId: number;
    },
  >() => MRT_ColumnDef<T>;
  status: <
    T extends {
      status: boolean;
    },
  >() => MRT_ColumnDef<T>;
};

export type UseProductTableColumns = {
  product: <
    T extends {
      productId: number;
    },
  >() => MRT_ColumnDef<T>;
  package: <
    T extends {
      packageId: number;
    },
  >() => MRT_ColumnDef<T>;
  qty: <
    T extends {
      qty: number;
    },
  >() => MRT_ColumnDef<T>;
  price: <
    T extends {
      price: number;
    },
  >() => MRT_ColumnDef<T>;
  amount: <
    T extends {
      qty: number;
      price: number;
    },
  >() => MRT_ColumnDef<T>;
};
