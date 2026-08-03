export type TechnoInvoiceLineRef = {
  productName: string | null;
  qty: number;
};

export type TechnoDyumansRow = {
  invoiceId: number;
  invoiceNumber: string;
  expectedDate: string | null;
  seller: { id: number; name: string } | null;
  currency: string | null;
  inSum: number;
  lines: TechnoInvoiceLineRef[];
  weight: number;
  childInvoiceId: number;
  childInvoiceNumber: string;
  childExpectedDate: string | null;
  childBuyer: { id: number; name: string } | null;
  outSum: number;
  transport: number;
  delta: number;
};

export type TechnoMarginRow = {
  invoiceId: number;
  invoiceNumber: string;
  expectedDate: string | null;
  partner: { id: number; name: string } | null;
  currency: string | null;
  lines: TechnoInvoiceLineRef[];
  weight: number;
  sum: number;
  transport: number;
  margin: number;
  delta: number;
};

export type TechnoSectionTotals = {
  weight: number;
  sum: number;
  transport: number;
  delta: number;
  outSum?: number;
  inSum?: number;
};

export type TechnoReportResponse = {
  startDate: string;
  endDate: string;
  process: number;
  dyumans: {
    company: { id: number; name: string } | null;
    rows: TechnoDyumansRow[];
    totals: TechnoSectionTotals;
  };
  ewbIn: {
    company: { id: number; name: string } | null;
    rows: TechnoMarginRow[];
    totals: TechnoSectionTotals;
  };
  ewbOut: {
    company: { id: number; name: string } | null;
    rows: TechnoMarginRow[];
    totals: TechnoSectionTotals;
  };
  klimana: {
    company: { id: number; name: string } | null;
    rows: TechnoMarginRow[];
    totals: TechnoSectionTotals;
  };
};
