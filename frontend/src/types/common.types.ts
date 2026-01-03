import type { MRT_ColumnDef } from 'mantine-react-table';

export type Theme = 'light' | 'dark';

export type UseThemeProps = {
  theme: Theme;
  toggleTheme: () => void;
};

export type GetCompanyDto = {
  name: string;
};

export type UseTableColumns = {
  seller: <
    T extends {
      seller: {
        name: string;
      };
    },
  >() => MRT_ColumnDef<T>;
  buyer: <
    T extends {
      buyer: {
        name: string;
      };
    },
  >() => MRT_ColumnDef<T>;
  recipient: <
    T extends {
      recipient: {
        name: string;
      };
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
      currency: {
        name: string;
      };
    },
  >() => MRT_ColumnDef<T>;
  byContract: <
    T extends {
      contract: {
        name: string;
      };
    },
  >() => MRT_ColumnDef<T>;
  status: <
    T extends {
      status: boolean;
    },
  >() => MRT_ColumnDef<T>;
};
