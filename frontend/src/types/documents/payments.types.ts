export type GetPaymentsDto = {
  id: number;
  sellerId: number;
  buyerId: number;
  status: boolean;
  documentSum: number;
  currencyId: number;
  expectedDate: Date;
  paymentLines: {
    id: number;
    invoice: {
      id: number;
      invoiceNumber: string;
    };
  }[];
};

export type GetPaymentDto = {
  payment: Payment;
};

export type Payment = {
  id: number;
  // invoiceNumber: string;
  // parent?: {
  //   id: number;
  //   invoiceNumber: string;
  // };
  // status: boolean;
  // expectedDate: Date;
  // sellerId: number;
  // sellerWarehouseId: number;
  // buyerId: number;
  // buyerWarehouseId: number;
  // recipientId?: number;
  // recipientWarehouseId?: number;
  // vat: number;
  // paymentBalance: number;
  // paymentDelay: number;
  // currencyId: number;
  // incoterms?: { name: string };
  // transportPlace: string;
  // ponz: number;
  // grossWeight: number;
  // transportAmount: number;
  // separation: boolean;
  // reportPeriod: Date;
  // contractInfo: string;
  // invoiceLines: InvoiceLine[];
  // comment?: string;
};

export type InvoiceLine = {
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
