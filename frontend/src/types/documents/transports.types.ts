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
  status: boolean;
  expectedDate: Date;
  comment?: string;
  company?: {
    name: string;
  };
  warehouseSender?: {
    name: string;
  };
  warehouseReceive?: {
    name: string;
  };
  productTransportLines: TransportLine[];
  productTransportServiceLines: TransportServiceLine[];
};

export type TransportLine = {
  id: number;
  productId: number;
  batchId: number;
  packageId: number;
  qty: number;
  product?: {
    name: string;
  };
  batch?: {
    name: string;
  };
  package?: {
    name: string;
  };
};

export type TransportServiceLine = {
  id: number;
  serviceId: number;
  qty: number;
  price: number;
};

