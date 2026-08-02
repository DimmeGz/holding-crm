import type {
  BatchedProductLineFormValue,
  ServiceLineFormValue,
} from '@/types/documents/contracts.types';

export type GetTransportsDto = {
  id: number;
  status: boolean;
  expectedDate: Date;
  companyId: number;
  warehouseSenderId: number;
  warehouseReceiveId: number;
};

export type GetTransportDto = {
  id: number;
  companyId: number;
  status: boolean;
  expectedDate: Date;
  comment?: string;
  warehouseSenderId: number;
  warehouseReceiveId: number;
  productTransportLines: TransportLine[];
  productTransportServiceLines: TransportServiceLine[];
};

export type TransportLine = {
  id: number;
  productId: number;
  batchId: number;
  packageId: number;
  qty: number;
  batch?: {
    name: string;
  };
};

export type TransportServiceLine = {
  id: number;
  serviceId: number;
  qty: number;
  price: number;
};

export type TransportFormValues = {
  companyId: string | null;
  warehouseSenderId: string | null;
  warehouseReceiveId: string | null;
  expectedDate: Date | null;
  comment: string;
  productTransportLines: BatchedProductLineFormValue[];
  productTransportServiceLines: ServiceLineFormValue[];
};

export type CreateTransportLinePayload = {
  productId: number;
  batchId: number;
  packageId: number;
  qty: number;
};

export type UpdateTransportLinePayload = CreateTransportLinePayload & {
  id?: number;
};

export type CreateTransportServiceLinePayload = {
  serviceId: number;
  qty: number;
  price: number;
};

export type UpdateTransportServiceLinePayload =
  CreateTransportServiceLinePayload & {
    id?: number;
  };

export type CreateTransportPayload = {
  companyId: number;
  warehouseSenderId: number;
  warehouseReceiveId: number;
  expectedDate?: Date;
  comment?: string;
  productTransportLines: CreateTransportLinePayload[];
  productTransportServiceLines: CreateTransportServiceLinePayload[];
};

export type UpdateTransportPayload = {
  companyId?: number;
  warehouseSenderId?: number;
  warehouseReceiveId?: number;
  expectedDate?: Date;
  comment?: string;
  productTransportLines: UpdateTransportLinePayload[];
  productTransportServiceLines: UpdateTransportServiceLinePayload[];
};
