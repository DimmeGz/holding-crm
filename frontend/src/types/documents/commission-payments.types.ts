export type GetCommissionPaymentsDto = {
  id: number;
  sellerId: number;
  buyerId: number;
  totalAmount: number;
  currencyId: number;
  status: boolean;
  expectedDate: Date;
  commissionInvoiceId: number;
  commissionPaymentLines: {
    id: number,
    commissionInvoiceId: number,
    amount: number
  }[]
};

export type GetCommissionPaymentDto = {
  id: number;
  sellerId: number;
  buyerId: number;
  currencyId: number;
  status: boolean;
  expectedDate: Date;
  amount: number;
};

