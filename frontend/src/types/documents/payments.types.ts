export type GetPaymentsDto = {
  id: number;
  sellerId: number;
  buyerId: number;
  status: boolean;
  documentSum: number;
  currencyId: number;
  expectedDate: Date;
  createdAt?: Date;
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
  comment?: string;
  documentSum?: number;
  paymentLines: PaymentLine[];
};

export type PaymentLine = {
  id: number;
  amount: number;
  invoice: { id: number; invoiceNumber: string };
  invoiceId?: number;
};

export type PaymentLineFormValue = {
  id?: number;
  invoiceId: string | null;
  amount: number;
};

export type PaymentFormValues = {
  sellerId: string | null;
  buyerId: string | null;
  currencyId: string | null;
  expectedDate: Date | null;
  comment: string;
  paymentLines: PaymentLineFormValue[];
};

export type CreatePaymentLinePayload = {
  invoiceId: number;
  amount: number;
};

export type UpdatePaymentLinePayload = CreatePaymentLinePayload & {
  id?: number;
};

export type CreatePaymentPayload = {
  sellerId: number;
  buyerId: number;
  currencyId: number;
  expectedDate: Date;
  comment?: string;
  paymentLines: CreatePaymentLinePayload[];
};

export type UpdatePaymentPayload = Partial<
  Omit<CreatePaymentPayload, 'paymentLines'>
> & {
  paymentLines: UpdatePaymentLinePayload[];
};
