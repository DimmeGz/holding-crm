export type GetCommissionInvoicesDto = {
  id: number;
  sellerId: number;
  buyerId: number;
  rate: number;
  documentSum: number;
  paymentBalance?: number;
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
  comment?: string;
  rate?: number;
  paymentBalance?: number;
  invoice: {
    id: number;
    invoiceNumber: string;
    children: {
      id: number;
      invoiceNumber: string;
      documentSum?: number;
    }[];
  };
  documentSum: number;
  currencyId: number;
};

export type CommissionInvoiceFormValues = {
  sellerId: string | null;
  buyerId: string | null;
  invoiceId: string | null;
  currencyId: string | null;
  creationDate: Date | null;
  rate: number;
  comment: string;
};

export type CreateCommissionInvoicePayload = {
  sellerId: number;
  buyerId: number;
  invoiceId: number;
  currencyId: number;
  creationDate?: Date;
  rate: number;
  comment?: string;
};

export type UpdateCommissionInvoicePayload = {
  sellerId?: number;
  currencyId?: number;
  creationDate?: Date;
  rate?: number;
  comment?: string;
};
