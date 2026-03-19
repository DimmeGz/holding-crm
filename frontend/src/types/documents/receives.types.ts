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
