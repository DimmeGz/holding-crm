import type {
  BatchedProductLineFormValue,
  ServiceLineFormValue,
} from '@/types/documents/contracts.types';

export type GetReceivesDto = {
  id: number;
  sellerId: number;
  buyerId: number;
  documentSum: number;
  currencyId: number;
  status: boolean;
  expectedDate: Date;
  shipment?: {
    id: number;
  };
};

export type Receive = {
  id: number;
  sellerId: number;
  buyerId: number;
  buyerWarehouseId: number;
  currencyId: number;
  status: boolean;
  expectedDate: Date;
  documentSum: number;
  incotermsId?: number;
  incoterms?: { name: string };
  transportPlace: string;
  transportAmount: number;
  comment?: string;
  shipment?: {
    id: number;
    invoice?: {
      id: number;
      invoiceNumber: string;
    };
  };
  receiveLines: ReceiveLine[];
  receiveServiceLines: ReceiveServiceLine[];
};

export type ReceiveLine = {
  id: number;
  productId: number;
  batchId: number;
  packageId: number;
  qty: number;
  price: number;
  batch?: {
    id: number;
    name: string;
  };
};

export type ReceiveServiceLine = {
  id: number;
  serviceId: number;
  qty: number;
  price: number;
};

export type ReceiveFormValues = {
  sellerId: string | null;
  buyerId: string | null;
  buyerWarehouseId: string | null;
  currencyId: string | null;
  shipmentId: string | null;
  expectedDate: Date | null;
  incotermsId: string | null;
  transportPlace: string;
  transportAmount: number | null;
  comment: string;
  receiveLines: BatchedProductLineFormValue[];
  receiveServiceLines: ServiceLineFormValue[];
};

export type CreateReceiveLinePayload = {
  productId: number;
  batchId: number;
  packageId: number;
  qty: number;
  price: number;
};

export type UpdateReceiveLinePayload = CreateReceiveLinePayload & {
  id?: number;
};

export type CreateReceiveServiceLinePayload = {
  serviceId: number;
  qty: number;
  price: number;
};

export type UpdateReceiveServiceLinePayload =
  CreateReceiveServiceLinePayload & {
    id?: number;
  };

export type CreateReceivePayload = {
  sellerId: number;
  buyerId: number;
  buyerWarehouseId: number;
  currencyId: number;
  shipmentId: number;
  expectedDate: Date;
  incotermsId: number;
  transportPlace?: string;
  transportAmount?: number;
  comment?: string;
  receiveLines: CreateReceiveLinePayload[];
  receiveServiceLines: CreateReceiveServiceLinePayload[];
};

export type UpdateReceivePayload = {
  sellerId: number;
  buyerId: number;
  buyerWarehouseId: number;
  currencyId: number;
  shipmentId: number;
  expectedDate: Date;
  incotermsId: number;
  transportPlace?: string;
  transportAmount?: number;
  comment?: string;
  receiveLines: UpdateReceiveLinePayload[];
  receiveServiceLines: UpdateReceiveServiceLinePayload[];
};
