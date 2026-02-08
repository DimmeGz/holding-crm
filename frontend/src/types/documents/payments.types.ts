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
  currencyId: number;
  status: boolean;
  expectedDate: Date;
  sellerId: number;
  buyerId: number;
  // invoiceNumber: string;
  // parent?: {
  //   id: number;
  //   invoiceNumber: string;
  // };
  // sellerWarehouseId: number;
  // buyerWarehouseId: number;
  // recipientId?: number;
  // recipientWarehouseId?: number;
  // vat: number;
  // paymentBalance: number;
  // paymentDelay: number;
  // incoterms?: { name: string };
  // transportPlace: string;
  // ponz: number;
  // grossWeight: number;
  // transportAmount: number;
  // separation: boolean;
  // reportPeriod: Date;
  // contractInfo: string;
  paymentLines: PaymentLine[];
  // comment?: string;
};

export type PaymentLine = {
  invoice: { id: number; invoiceNumber: string };
  id: string;
  amount: number;
};
