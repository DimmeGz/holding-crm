export type WarehouseNamedRef = {
  id: number;
  name: string;
};

export type WarehouseCompanyRef = WarehouseNamedRef & {
  companyType?: string;
};

export type WarehouseCurrencyRef = {
  id?: number;
  name: string;
};

export type GetWarehouseAccountingDto = {
  id: number;
  qty: number;
  cost: number;
  batch: {
    id: number;
    name: string;
    product: WarehouseNamedRef;
  };
  package: WarehouseNamedRef;
  warehouse: WarehouseNamedRef;
  company: WarehouseCompanyRef;
  currency: WarehouseCurrencyRef;
};

export type WarehouseListQuery = {
  company?: number;
  warehouse?: number;
  process?: number;
};

export type ReportCompanyRef = WarehouseNamedRef;

export type ReportShipmentReceive = {
  id: number;
  status: boolean;
};

export type ReportShipment = {
  id: number;
  status: boolean;
  receives: ReportShipmentReceive[];
};

export type ReportInvoiceLine = {
  id: number;
  qty: number;
  price: number;
  product: WarehouseNamedRef;
  batch?: WarehouseNamedRef | null;
  invoice: {
    id: number;
    status: boolean;
    invoiceNumber: string;
    expectedDate?: Date | string | null;
    currencyId: number;
    seller: ReportCompanyRef;
    buyer: ReportCompanyRef;
    shipments?: ReportShipment[];
  };
};

export type ReportProductionLine = {
  id: number;
  qty: number;
  product: WarehouseNamedRef;
  batch: WarehouseNamedRef;
  production: {
    id: number;
    status: boolean;
    expectedDate?: Date | string | null;
    company: ReportCompanyRef;
  };
};

export type GetProductReportDto = {
  product: WarehouseNamedRef;
  invoiceLines: ReportInvoiceLine[];
  productionOutLines: ReportProductionLine[];
  productionInLines: ReportProductionLine[];
};

export type GetBatchReportDto = {
  batch: WarehouseNamedRef & {
    product: WarehouseNamedRef;
  };
  invoiceLines: ReportInvoiceLine[];
  productionOutLines: ReportProductionLine[];
  productionInLines: ReportProductionLine[];
};
