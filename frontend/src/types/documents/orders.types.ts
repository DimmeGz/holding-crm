import type { ServiceLineFormValue } from '@/types/documents/contracts.types';

export type GetOrdersDto = {
  id: number;
  orderNumber: string;
  documentSum: number;
  sellerId: number;
  buyerId: number;
  recipientId: number;
  currencyId: number;
  contract: {
    createdById: number;
    name: string;
  };
  orderProductIds: number[];
  expectedDate?: Date;
  confirmExpectedDate?: Date;
  status: boolean;
};

export type GetOrdersQuery = {
  status?: boolean;
  hidden?: boolean;
  sellerId?: number;
  buyerId?: number;
  recipientId?: number;
  year?: number;
  type?: string;
  process?: number;
};

export type GetOrderDto = {
  order: Order;
  invoices: {
    createdById: number;
    id: number;
    status: boolean;
    invoiceNumber: string;
    invoiceLines: {
      id: string;
      qty: number;
      price: number;
      packageId: number;
      cost: number;
      productId: number;
      batchId: number;
      countryOfOriginId: number;
      orderId: number;
      palletsQty: number;
      grossWeight: number;
    }[];
    shipments: [
      {
        createdById: number;
        id: number;
        status: boolean;
        receives: {
          createdById: number;
          id: number;
          status: boolean;
        }[];
      },
    ];
    payments: {
      createdById: number;
      id: number;
      status: boolean;
    }[];
  }[];
  orderConfirmations: {
    createdById: number;
    id: number;
    confirmationNumber: string;
  }[];
};

export type Order = {
  id: number;
  status: boolean;
  orderNumber: string;
  sellerId: number;
  sellerWarehouseId: number;
  buyerId: number;
  buyerWarehouseId: number;
  recipientId?: number | null;
  recipientWarehouseId?: number | null;
  createdAt: Date;
  signatureDate?: Date;
  expectedDate?: Date;
  isDateAsap?: boolean;
  vat: number;
  currencyId: number;
  paymentDelay: number;
  contractId: number;
  incotermsId: number;
  incoterms?: { name: string };
  transportPlace: string;
  carPlate?: string;
  comment?: string;
  isHidden?: boolean;
  contract: {
    id: number;
    name: string;
  };
  confirmation?: Confirmation;
  orderLines: OrderLine[];
  orderServiceLines?: OrderServiceLine[];
};

export type OrderLine = {
  id?: number;
  qty: number;
  price: number;
  batchRename?: string;
  productManId: number;
  productBuyId: number;
  packageId: number;
};

export type OrderServiceLine = {
  id?: number;
  serviceId: number;
  qty: number;
  price: number;
};

type Confirmation = {
  confirmationNumber: string;
  createdAt: Date;
  buyerWarehouseId: number;
  recipientId?: number;
  recipientWarehouseId?: number;
  paymentDelay: number;
  incoterms: { name: string };
  transportPlace: string;
  expectedDate: Date;
  orderLines: OrderLine[];
};

export type OrderProductLineFormValue = {
  id?: number;
  productManId: string | null;
  productBuyId: string | null;
  packageId: string | null;
  batchRename: string;
  qty: number;
  price: number;
};

export type OrderFormValues = {
  orderNumber: string;
  contractId: string | null;
  signatureDate: Date | null;
  expectedDate: Date | null;
  isDateAsap: boolean;
  sellerId: string | null;
  sellerWarehouseId: string | null;
  buyerId: string | null;
  buyerWarehouseId: string | null;
  recipientId: string | null;
  recipientWarehouseId: string | null;
  currencyId: string | null;
  vat: number;
  paymentDelay: number;
  incotermsId: string | null;
  transportPlace: string;
  carPlate: string;
  comment: string;
  isHidden: boolean;
  orderLines: OrderProductLineFormValue[];
  orderServiceLines: ServiceLineFormValue[];
};

export type CreateOrderLinePayload = {
  productManId: number;
  productBuyId: number;
  packageId: number;
  qty: number;
  price: number;
  batchRename?: string;
};

export type UpdateOrderLinePayload = CreateOrderLinePayload & {
  id?: number;
};

export type CreateOrderServiceLinePayload = {
  serviceId: number;
  qty: number;
  price: number;
};

export type UpdateOrderServiceLinePayload = CreateOrderServiceLinePayload & {
  id?: number;
};

export type CreateOrderPayload = {
  orderNumber?: string;
  contractId: number;
  signatureDate?: Date;
  expectedDate?: Date;
  isDateAsap?: boolean;
  sellerId: number;
  sellerWarehouseId: number;
  buyerId: number;
  buyerWarehouseId: number;
  recipientId?: number | null;
  recipientWarehouseId?: number | null;
  currencyId: number;
  vat?: number;
  paymentDelay?: number;
  incotermsId: number;
  transportPlace?: string;
  carPlate?: string;
  comment?: string;
  isHidden?: boolean;
  orderLines: CreateOrderLinePayload[];
  orderServiceLines: CreateOrderServiceLinePayload[];
};

export type UpdateOrderPayload = Omit<
  CreateOrderPayload,
  'orderNumber' | 'orderLines' | 'orderServiceLines'
> & {
  orderNumber: string;
  orderLines: UpdateOrderLinePayload[];
  orderServiceLines: UpdateOrderServiceLinePayload[];
};

export type CompanyDefaultWarehouse = {
  id: number;
  defaultWarehouseId?: number | null;
};
