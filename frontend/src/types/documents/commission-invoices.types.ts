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
  commissionInvoice: CommissionInvoice;
};

export type CommissionInvoice = {
  id: number;
  invoiceNumber: string;
  parent?: {
    id: number;
    invoiceNumber: string;
  };
  status: boolean;
  expectedDate: Date;
  sellerId: number;
  sellerWarehouseId: number;
  buyerId: number;
  buyerWarehouseId: number;
  recipientId?: number;
  recipientWarehouseId?: number;
  vat: number;
  paymentBalance: number;
  paymentDelay: number;
  currencyId: number;
  incoterms?: { name: string };
  transportPlace: string;
  ponz: number;
  grossWeight: number;
  transportAmount: number;
  separation: boolean;
  reportPeriod: Date;
  contractInfo: string;
  commissionInvoiceLines: CommissionInvoiceLine[];
  comment?: string;
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
