import type { ServiceLineFormValue } from '@/types/documents/contracts.types';

export type GetInvoicesDto = {
  id: number;
  invoiceNumber: string;
  sellerId: number;
  buyerId: number;
  recipientId: number;
  documentSum: number;
  paymentBalance?: number;
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
  incotermsId?: number;
  incoterms?: { name: string };
  transportPlace: string;
  carPlate?: string;
  ponz: number;
  grossWeight: number;
  transportAmount: number;
  separation: boolean;
  reportPeriod: Date;
  reportDuplicating: boolean;
  contractInfo: string;
  invoiceLines: InvoiceLine[];
  invoiceServiceLines: InvoiceServiceLine[];
  comment?: string;
};

export type InvoiceLine = {
  id?: number;
  orderId?: number;
  batchId?: number;
  order?: { id: number; orderNumber: string };
  productId: number;
  batch?: { id: number; name: string };
  packageId: number;
  qty: number;
  price: number;
  cost: number;
  palletsQty: number;
  grossWeight: number;
  countryOfOriginId: number;
};

export type InvoiceServiceLine = {
  id: number;
  serviceId: number;
  qty: number;
  price: number;
};

export type InvoiceProductLineFormValue = {
  id?: number;
  orderId: string | null;
  productId: string | null;
  batchId: string | null;
  packageId: string | null;
  palletsQty: number;
  qty: number;
  price: number;
  cost: number | null;
  countryOfOriginId: string | null;
  grossWeight: number | null;
};

export type InvoiceFormValues = {
  invoiceNumber: string;
  expectedDate: Date | null;
  sellerId: string | null;
  sellerWarehouseId: string | null;
  buyerId: string | null;
  buyerWarehouseId: string | null;
  recipientId: string | null;
  recipientWarehouseId: string | null;
  currencyId: string | null;
  vat: number;
  paymentDelay: number;
  invoiceId: number | null;
  contractId: string | null;
  incotermsId: string | null;
  transportPlace: string;
  carPlate: string;
  ponz: number | null;
  grossWeight: number | null;
  transportAmount: number | null;
  comment: string;
  contractInfo: string;
  reportPeriod: Date | null;
  separation: boolean;
  reportDuplicating: boolean;
  invoiceLines: InvoiceProductLineFormValue[];
  invoiceServiceLines: ServiceLineFormValue[];
};

export type CreateInvoiceLinePayload = {
  productId: number;
  batchId: number;
  packageId: number;
  palletsQty: number;
  qty: number;
  price: number;
  cost?: number;
  countryOfOriginId?: number;
  grossWeight?: number;
  orderId: number;
};

export type CreateInvoiceLineByContractPayload = Omit<
  CreateInvoiceLinePayload,
  'orderId'
>;

export type UpdateInvoiceLinePayload = CreateInvoiceLinePayload & {
  id?: number;
};

export type CreateInvoiceServiceLinePayload = {
  serviceId: number;
  qty: number;
  price: number;
};

export type UpdateInvoiceServiceLinePayload = CreateInvoiceServiceLinePayload & {
  id?: number;
};

export type CreateInvoicePayload = {
  invoiceNumber: string;
  expectedDate: Date;
  sellerId: number;
  sellerWarehouseId: number;
  buyerId: number;
  buyerWarehouseId: number;
  recipientId?: number;
  recipientWarehouseId?: number;
  currencyId: number;
  vat?: number;
  paymentDelay?: number;
  invoiceId?: number;
  incotermsId: number;
  transportPlace?: string;
  carPlate?: string;
  ponz?: number;
  grossWeight?: number;
  transportAmount?: number;
  comment?: string;
  contractInfo?: string;
  reportPeriod?: Date;
  separation?: boolean;
  reportDuplicating: boolean;
  invoiceLines: CreateInvoiceLinePayload[];
  invoiceServiceLines: CreateInvoiceServiceLinePayload[];
};

export type CreateInvoiceByContractPayload = Omit<
  CreateInvoicePayload,
  'invoiceLines' | 'invoiceId'
> & {
  contractId: number;
  invoiceLines: CreateInvoiceLineByContractPayload[];
};

export type UpdateInvoicePayload = Omit<
  CreateInvoicePayload,
  'invoiceLines' | 'invoiceServiceLines'
> & {
  invoiceLines: UpdateInvoiceLinePayload[];
  invoiceServiceLines: UpdateInvoiceServiceLinePayload[];
};
