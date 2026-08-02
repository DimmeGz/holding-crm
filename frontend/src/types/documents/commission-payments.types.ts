export type CommissionPaymentLine = {
  id: number;
  commissionInvoiceId: number;
  amount: number;
};

export type GetCommissionPaymentsDto = {
  id: number;
  sellerId: number;
  buyerId: number;
  totalAmount: number;
  currencyId: number;
  status: boolean;
  expectedDate: Date;
  commissionInvoiceId?: number;
  commissionPaymentLines: CommissionPaymentLine[];
};

export type GetCommissionPaymentDto = {
  id: number;
  sellerId: number;
  buyerId: number;
  currencyId: number;
  status: boolean;
  expectedDate: Date;
  comment?: string;
  commissionPaymentLines?: CommissionPaymentLine[];
};

export type CommissionPaymentLineFormValue = {
  id?: number;
  commissionInvoiceId: string | null;
  amount: number;
};

export type CommissionPaymentFormValues = {
  sellerId: string | null;
  buyerId: string | null;
  currencyId: string | null;
  expectedDate: Date | null;
  comment: string;
  commissionPaymentLines: CommissionPaymentLineFormValue[];
};

export type CreateCommissionPaymentLinePayload = {
  commissionInvoiceId: number;
  amount: number;
};

export type UpdateCommissionPaymentLinePayload =
  CreateCommissionPaymentLinePayload & {
    id?: number;
  };

export type CreateCommissionPaymentPayload = {
  sellerId: number;
  buyerId: number;
  currencyId: number;
  expectedDate?: Date;
  comment?: string;
  commissionPaymentLines: CreateCommissionPaymentLinePayload[];
};

export type UpdateCommissionPaymentPayload = Partial<
  Omit<CreateCommissionPaymentPayload, 'commissionPaymentLines'>
> & {
  commissionPaymentLines: UpdateCommissionPaymentLinePayload[];
};
