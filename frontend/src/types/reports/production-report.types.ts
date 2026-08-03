export type ProductionReportInvoiceRef = {
  id: number;
  number: string;
};

export type ProductionReportLine = {
  id: number;
  qty: number;
  batch: { id: number; name: string } | null;
  product: { id: number; name: string } | null;
  invoices: ProductionReportInvoiceRef[];
};

export type ProductionReportDoc = {
  id: number;
  expectedDate: string | null;
  lines: ProductionReportLine[];
};

export type ProductionReportResponse = {
  company: { id: number; name: string };
  outProductions: ProductionReportDoc[];
  inProductions: ProductionReportDoc[];
  outQty: number;
  inQty: number;
};
