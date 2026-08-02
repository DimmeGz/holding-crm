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
  orders: ContractRelatedDocument[];
};

export type ContractRelatedDocument = {
  id: number;
  invoices: {
    id: number;
    invoiceNumber: string;
    shipments: {
      id: number;
      receives: {
        id: number;
      }[];
    }[];
    payments: {
      id: number;
    }[];
  }[];
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
  incotermsId?: number;
  incoterms?: { name: string };
  transportPlace?: string;
  orderPrefix?: string;
  comment?: string;
  parentId?: number;
  contractLines: ContractLine[];
  contractServiceLines?: ContractServiceLine[];
};

export type ContractLine = {
  id?: number;
  productId: number;
  packageId: number;
  qty: number;
  shipQty: number;
  shipLeft?: number;
  price: number;
};

export type ContractServiceLine = {
  id?: number;
  serviceId: number;
  qty: number;
  price: number;
  service?: { name: string };
};

export type CreateContractLinePayload = {
  productId: number;
  packageId: number;
  qty: number;
  shipQty: number;
  price: number;
};

export type UpdateContractLinePayload = CreateContractLinePayload & {
  id?: number;
};

export type CreateServiceLinePayload = {
  serviceId: number;
  qty: number;
  price: number;
};

export type UpdateServiceLinePayload = CreateServiceLinePayload & {
  id?: number;
};

export type CreateContractPayload = {
  name: string;
  sellerId: number;
  buyerId: number;
  currencyId: number;
  signatureDate?: Date;
  term?: Date | null;
  vat?: number;
  paymentDelay?: number;
  incotermsId?: number | null;
  transportPlace?: string;
  orderPrefix?: string;
  comment?: string;
  parentId?: number | null;
  contractLines: CreateContractLinePayload[];
  contractServiceLines: CreateServiceLinePayload[];
};

export type UpdateContractPayload = Omit<
  CreateContractPayload,
  'contractLines' | 'contractServiceLines'
> & {
  contractLines: UpdateContractLinePayload[];
  contractServiceLines: UpdateServiceLinePayload[];
};

export type ProductLineFormValue = {
  id?: number;
  productId: string | null;
  packageId: string | null;
  qty: number;
  shipQty: number;
  price: number;
};

export type BatchedProductLineFormValue = {
  id?: number;
  productId: string | null;
  batchId: string | null;
  packageId: string | null;
  qty: number;
  price: number;
};

export type ServiceLineFormValue = {
  id?: number;
  serviceId: string | null;
  qty: number;
  price: number;
};

export type ContractFormValues = {
  name: string;
  sellerId: string | null;
  buyerId: string | null;
  currencyId: string | null;
  signatureDate: Date | null;
  term: Date | null;
  vat: number;
  paymentDelay: number;
  incotermsId: string | null;
  transportPlace: string;
  orderPrefix: string;
  comment: string;
  parentId: string | null;
  contractLines: ProductLineFormValue[];
  contractServiceLines: ServiceLineFormValue[];
};
