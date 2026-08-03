export type BatchesListQuery = {
  process?: number;
};

export type BatchListItem = {
  id: number;
  name: string;
  hasCustomFields: boolean;
};

export type BatchesListGroup = {
  product: {
    id: number;
    name: string;
  };
  batches: BatchListItem[];
};

export type BatchDetailCustomField = {
  id: number;
  name: string;
  description: string | null;
  defaultValue: string | null;
  unit: string | null;
  priority: number;
  value: string | null;
};

export type BatchDetail = {
  id: number;
  name: string;
  productId: number;
  product: {
    id: number;
    name: string;
  };
  countryOfOriginId: number | null;
  customFields: BatchDetailCustomField[];
};

export type CreateBatchPayload = {
  productId: number;
  name: string;
  countryOfOriginId?: number | null;
};

export type UpdateBatchCustomFieldPayload = {
  customFieldId: number;
  value?: string | null;
};

export type UpdateBatchPayload = {
  productId?: number;
  name?: string;
  countryOfOriginId?: number | null;
  customFields?: UpdateBatchCustomFieldPayload[];
};

export type BatchMutationResult = {
  id: number;
  name: string;
  productId: number;
  countryOfOriginId: number | null;
  isArchived: boolean;
};
