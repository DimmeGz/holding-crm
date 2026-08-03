export class BatchListItemDTO {
  id: number;
  name: string;
  hasCustomFields: boolean;
}

export class BatchesListGroupDTO {
  product: {
    id: number;
    name: string;
  };
  batches: BatchListItemDTO[];
}
