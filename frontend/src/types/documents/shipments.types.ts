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
  receives: Receive[];
};

export type Shipment = {
  id: number;
  sellerId: number;
  sellerWarehouseId: number;
  buyerId: number;
  currencyId: number;
  status: boolean;
  invoice: { id: number, invoiceNumber: string };
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

export type Receive = {
  id: number;
  status: boolean;
};
