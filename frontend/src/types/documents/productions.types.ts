export type GetProductionsDto = {
  id: number;
  status: boolean;
  expectedDate: Date;
  company?: {
    name: string;
  };
  warehouse?: {
    name: string;
  };
  productionOutLines?: {
    productId: number;
  }[];
};

export type ProductionLineBase = {
  id: number;
  qty: number;
  productId: number;
  batchId: number;
  packageId: number;
  product?: {
    id: number;
    name: string;
  };
  batch?: {
    id: number;
    name: string;
  };
  package?: {
    name: string;
  };
};

export type ProductionOutLine = ProductionLineBase & {
  cost: number;
};

export type ProductionInLine = ProductionLineBase;

export type Production = {
  id: number;
  status: boolean;
  expectedDate: Date;
  comment?: string;
  company?: {
    name: string;
  };
  warehouse?: {
    name: string;
  };
  productionOutLines: ProductionOutLine[];
  productionInLines: ProductionInLine[];
};
