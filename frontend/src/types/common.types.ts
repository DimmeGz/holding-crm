export type Theme = 'light' | 'dark';

export type UseThemeProps = {
  theme: Theme;
  toggleTheme: () => void;
};

export type LibsData = {
  companies: Record<number, string>;
  warehouses: Record<number, string>;
  currencies: Record<number, string>;
  products: Record<number, string>;
};

export type LibsStore = LibsData & {
  isLoaded: boolean;
  loadAll: () => Promise<void>;

  getCompanyName: (id: number) => string;
  getWarehouseName: (id: number) => string;
  getCurrencyName: (id: number) => string;
  getProductName: (id: number) => string;
};
