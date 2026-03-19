export type GetCommissionInvoicesDto = {
  id: number;
  sellerId: number;
  buyerId: number;
  rate: number;
  documentSum: number;
  currencyId: number;
  status: boolean;
  invoice: {
    id: number;
    invoiceNumber: string;
    children: {
      id: number;
      invoiceNumber: string;
    }[];
  };
};

export type GetCommissionInvoiceDto = {
  id: number;
  status: boolean;
  sellerId: number;
  buyerId: number;
  creationDate: Date;
  invoice: {
    id: number;
    invoiceNumber: string;
    children: {
      id: number;
      invoiceNumber: string;
    }[];
  };
  documentSum: number;
  currencyId: number;
};

export type CommissionInvoiceLine = {
  order: { id: number; orderNumber: string };
  productId: number;
  batch: { id: number; name: string };
  packageId: number;
  qty: number;
  price: number;
  cost: number;
  palletsQty: number;
  grossWeight: number;
  countryOfOriginId: number;
};
