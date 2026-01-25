import type { TreeNodeData } from "@mantine/core";

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

export type GetContractDto = {
  contract: Contract;
  orders: TreeNodeData[];
};

export type Contract = {
  id: number;
  name: string;
  status: boolean;
  signatureDate: Date;
  term?: Date;
  sellerId: number;
  buyerId: number;
  currencyId: number;
  vat: number;
  paymentDelay: number;
  incoterms?: { name: string };
  orderPrefix: string;
  contractLines: ContractLine[];
};

export type ContractLine = {
  productId: number;
  packageId: number;
  qty: number;
  shipQty: number; // кратність відвантаження
  shipLeft: number;
  price: number;
};
