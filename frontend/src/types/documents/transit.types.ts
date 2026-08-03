export type TransitLineCompany = {
  id: number;
  name: string;
};

export type TransitLineShipment = {
  id: number;
  expectedDate?: Date | string | null;
  seller: TransitLineCompany;
  buyer: TransitLineCompany;
};

export type TransitLineReceive = {
  id: number;
  expectedDate?: Date | string | null;
};

export type TransitLineBatch = {
  id: number;
  name: string;
  product: {
    id: number;
    name: string;
  };
};

export type TransitLinePackage = {
  id: number;
  name: string;
};

export type GetTransitLineDto = {
  id: number;
  qty: number;
  shipment: TransitLineShipment;
  receive?: TransitLineReceive | null;
  batch: TransitLineBatch;
  package: TransitLinePackage;
};
