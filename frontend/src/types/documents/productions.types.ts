import type { BatchedProductLineFormValue } from '@/types/documents/contracts.types';

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
  companyId: number;
  warehouseId: number;
  company?: {
    name: string;
  };
  warehouse?: {
    name: string;
  };
  productionOutLines: ProductionOutLine[];
  productionInLines: ProductionInLine[];
};

export type ProductionFormValues = {
  companyId: string | null;
  warehouseId: string | null;
  expectedDate: Date | null;
  comment: string;
  productionOutLines: BatchedProductLineFormValue[];
  productionInLines: BatchedProductLineFormValue[];
};

export type CreateProductionOutLinePayload = {
  productId: number;
  batchId: number;
  packageId: number;
  qty: number;
  cost: number;
};

export type CreateProductionInLinePayload = {
  productId: number;
  batchId: number;
  packageId: number;
  qty: number;
};

export type UpdateProductionOutLinePayload = CreateProductionOutLinePayload & {
  id?: number;
};

export type UpdateProductionInLinePayload = CreateProductionInLinePayload & {
  id?: number;
};

export type CreateProductionPayload = {
  companyId: number;
  warehouseId: number;
  expectedDate?: Date;
  comment?: string;
  productionOutLines: CreateProductionOutLinePayload[];
  productionInLines: CreateProductionInLinePayload[];
};

export type UpdateProductionPayload = {
  companyId?: number;
  warehouseId?: number;
  expectedDate?: Date;
  comment?: string;
  productionOutLines: UpdateProductionOutLinePayload[];
  productionInLines: UpdateProductionInLinePayload[];
};
