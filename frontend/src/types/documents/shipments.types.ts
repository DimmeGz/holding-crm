import type {
  BatchedProductLineFormValue,
  ServiceLineFormValue,
} from '@/types/documents/contracts.types';

export type GetShipmentsDto = {
  id: number;
  sellerId: number;
  buyerId: number;
  documentSum: number;
  currencyId: number;
  status: boolean;
  expectedDate: Date;
  invoice: { invoiceNumber: string };
};

export type GetShipmentDto = {
  shipment: Shipment;
  receives: ReceiveRef[];
};

export type Shipment = {
  id: number;
  sellerId: number;
  sellerWarehouseId: number;
  buyerId: number;
  currencyId: number;
  status: boolean;
  invoice: {
    id: number;
    invoiceNumber: string;
    buyerWarehouseId?: number;
  };
  incotermsId?: number;
  incoterms?: { name: string };
  documentSum: number;
  expectedDate: Date;
  transportPlace: string;
  transportAmount: number;
  comment?: string;
  shipmentLines: ShipmentLine[];
  shipmentServiceLines: ShipmentServiceLine[];
};

export type ShipmentLine = {
  id: number;
  productId: number;
  batchId: number;
  packageId: number;
  qty: number;
  price: number;
};

export type ShipmentServiceLine = {
  id: number;
  serviceId: number;
  qty: number;
  price: number;
};

export type ReceiveRef = {
  id: number;
  status: boolean;
};

export type ShipmentFormValues = {
  sellerId: string | null;
  sellerWarehouseId: string | null;
  buyerId: string | null;
  currencyId: string | null;
  invoiceId: string | null;
  expectedDate: Date | null;
  incotermsId: string | null;
  transportPlace: string;
  transportAmount: number | null;
  comment: string;
  shipmentLines: BatchedProductLineFormValue[];
  shipmentServiceLines: ServiceLineFormValue[];
};

export type CreateShipmentLinePayload = {
  productId: number;
  batchId: number;
  packageId: number;
  qty: number;
  price: number;
};

export type UpdateShipmentLinePayload = CreateShipmentLinePayload & {
  id?: number;
};

export type CreateShipmentServiceLinePayload = {
  serviceId: number;
  qty: number;
  price: number;
};

export type UpdateShipmentServiceLinePayload =
  CreateShipmentServiceLinePayload & {
    id?: number;
  };

export type CreateShipmentPayload = {
  sellerId: number;
  sellerWarehouseId: number;
  buyerId: number;
  currencyId: number;
  invoiceId: number;
  expectedDate: Date;
  incotermsId: number;
  transportPlace?: string;
  transportAmount?: number;
  comment?: string;
  shipmentLines: CreateShipmentLinePayload[];
  shipmentServiceLines: CreateShipmentServiceLinePayload[];
};

export type UpdateShipmentPayload = {
  sellerId: number;
  sellerWarehouseId: number;
  buyerId: number;
  currencyId: number;
  invoiceId: number;
  expectedDate: Date;
  incotermsId: number;
  transportPlace?: string;
  transportAmount?: number;
  comment?: string;
  shipmentLines: UpdateShipmentLinePayload[];
  shipmentServiceLines: UpdateShipmentServiceLinePayload[];
};
