export type CompanyAccount = {
  id: number;
  balance: number;
  debt: number;
  wait: number;
  currency?: {
    id: number;
    name: string;
  };
};

export type CompanyListItem = {
  id: number;
  name: string;
  accounts?: CompanyAccount[];
  defaultWarehouse?: {
    id: number;
    name: string;
  } | null;
};

export type CompanyInvoiceRef = {
  id: number;
  invoiceNumber: string;
  paymentBalance: number;
  expectedDate: string;
  paymentDelay: number;
  sellerId: number;
  buyerId: number;
  currencyId: number;
  seller?: {
    id: number;
    name: string;
  };
  buyer?: {
    id: number;
    name: string;
  };
};

export type CompanyDetail = {
  id: number;
  name: string;
  defaultWarehouseId?: number | null;
  defaultWarehouse?: {
    id: number;
    name: string;
  } | null;
  accounts?: CompanyAccount[];
  incomeInvoices?: CompanyInvoiceRef[];
  outcomeInvoices?: CompanyInvoiceRef[];
};

export type CompanyAccountRow = {
  accountId: number;
  companyId: number;
  companyName: string;
  currencyId: number;
  currencyName: string;
  balance: number;
  wait: number;
  debt: number;
};
