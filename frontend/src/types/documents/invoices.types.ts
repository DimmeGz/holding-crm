export type GetInvoicesDto = {
  id: number;
  invoiceNumber: string;
  sellerId: number;
  buyerId: number;
  recipientId: number;
  documentSum: number;
  currencyId: number;
  status: boolean;
  expectedDate: Date;
  parent?: {
    id: number;
    invoiceNumber: string;
  };
};

export type GetInvoiceDto = {
  invoice: Invoice;
};

export type Invoice = {
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
  // contractLines: ContractLine[];
};
