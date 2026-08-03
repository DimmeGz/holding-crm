export type ProductionReportInvoiceRef = {
  id: number;
  number: string;
};

export type ProductionReportLineDTO = {
  id: number;
  qty: number;
  batch: { id: number; name: string } | null;
  product: { id: number; name: string } | null;
  invoices: ProductionReportInvoiceRef[];
};

export type ProductionReportDocDTO = {
  id: number;
  expectedDate: string | Date | null;
  lines: ProductionReportLineDTO[];
};

export class ProductionReportResponseDTO {
  company: {
    id: number;
    name: string;
  };
  /** Consumed stock (productionOutLines) — «Використано» */
  outProductions: ProductionReportDocDTO[];
  /** Produced stock (productionInLines) — «Виготовлено» */
  inProductions: ProductionReportDocDTO[];
  outQty: number;
  inQty: number;
}
