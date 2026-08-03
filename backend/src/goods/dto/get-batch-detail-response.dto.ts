export class BatchDetailCustomFieldDTO {
  id: number;
  name: string;
  description: string | null;
  defaultValue: string | null;
  unit: string | null;
  priority: number;
  value: string | null;
}

export class GetBatchDetailResponseDTO {
  id: number;
  name: string;
  productId: number;
  product: {
    id: number;
    name: string;
  };
  countryOfOriginId: number | null;
  customFields: BatchDetailCustomFieldDTO[];
}
