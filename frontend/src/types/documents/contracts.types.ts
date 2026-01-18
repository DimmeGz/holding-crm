export type GetContractsDto = BaseContractDTO & {
  children?: (BaseContractDTO & {
    children?: [];
  })[];
};

type BaseContractDTO = {
  id: number;
  sellerId: number;
  buyerId: number;
  status: boolean;
  signatureDate: Date;
  name: string;
  term: Date;
  parentId: number;
  isArchived: boolean;
};
