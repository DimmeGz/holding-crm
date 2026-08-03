export type MonthDataSnapshot = {
  inQty: number;
  inSum: number;
  inVat: number;
  inTransport: number;
  inPay: number;
  outQty: number;
  outSum: number;
  outVat: number;
  outTransport: number;
  outPay: number;
  commission: number;
  commissionPay: number;
  commissionLeft: number;
  delta: number;
};

export type MonthDataBlock = {
  saved: {
    operatingOutgoings: number;
    factVatReturn: number | null;
    cashflow: number;
    warehouse: number;
  } | null;
  snapshot: MonthDataSnapshot;
  countVatReturn: number | null;
};

export type ReportPaymentRef = {
  id: number;
  date: string | null;
  sum: number;
};

type MonthReportBase = {
  company: { id: number; name: string; reportType: number };
  date: string;
  process: number | null;
  monthData: MonthDataBlock;
};

export type Type0Report = MonthReportBase & {
  reportType: 0;
  lines: Array<{
    orderIds: number[];
    orderNumbers: string[];
    seller: { id: number; name: string } | null;
    inInvoice: {
      id: number;
      number: string;
      expectedDate: string | null;
      reportPeriod: string | null;
    };
    inInvoiceSum: number;
    inPayments: ReportPaymentRef[];
    inPaymentSum: number;
    outInvoices: Array<{
      id: number;
      number: string;
      expectedDate: string | null;
      buyer: { id: number; name: string } | null;
    }>;
    outInvoiceSum: number;
    outTransportSum: number;
    outPayments: ReportPaymentRef[];
    outPaymentSum: number;
    commission: { id: number; documentSum: number; rate: number } | null;
    comSum: number;
    comPayments: ReportPaymentRef[];
    comPaymentsSum: number;
    qty: number;
    delta: number;
  }>;
  totals: {
    qty: number;
    inSum: number;
    inPaySum: number;
    outSum: number;
    outPaySum: number;
    outTransportSum: number;
    comSum: number;
    comPaySum: number;
    comLeftSum: number;
    delta: number;
  };
};

export type Type1Report = MonthReportBase & {
  reportType: 1;
  incomes: Type1Row[];
  outgoings: Type1Row[];
  incomeTotal: Type1SideTotals;
  outgoingTotal: Type1SideTotals;
};

export type Type1Row = {
  invoice: {
    id: number;
    number: string;
    expectedDate: string | null;
    reportPeriod: string | null;
    vat: number;
    documentSum: number;
    partner: { id: number; name: string } | null;
  };
  lines: Array<{
    id: number;
    qty: number;
    price: number;
    cost: number;
    product: { id: number; name: string } | null;
  }>;
  sum: number;
  cost: number;
  vat: number;
  transport: number;
  paymentSum: number;
  payments: ReportPaymentRef[];
};

export type Type1SideTotals = {
  qty: number;
  sum: number;
  cost: number;
  vat: number;
  transport: number;
  pay: number;
};

export type Type2Report = MonthReportBase & {
  reportType: 2;
  incomes: Array<{
    productId: number;
    productName: string;
    qty: number;
    sum: number;
  }>;
  outgoings: Array<{
    productId: number;
    productName: string;
    qty: number;
    sum: number;
  }>;
  inQty: number;
  inSum: number;
  outQty: number;
  outSum: number;
};

export type Type3LineRow = {
  lineId: number;
  invoiceId: number;
  invoiceNumber: string;
  expectedDate: string | null;
  reportPeriod: string | null;
  partner: { id: number; name: string } | null;
  productName: string | null;
  serviceName: string | null;
  qty: number;
  price: number;
  cost: number;
  transport: number;
  paySum: number;
  payments: ReportPaymentRef[];
  isService: boolean;
  isDouble: boolean;
};

export type Type3Report = MonthReportBase & {
  reportType: 3;
  inLines: Type3LineRow[];
  outLines: Type3LineRow[];
  inServiceLines: Type3LineRow[];
  outServiceLines: Type3LineRow[];
  doubleServiceLines: Type3LineRow[];
  inSum: number;
  inCost: number;
  inVatSum: number;
  inPaySum: number;
  inTotalQty: number;
  inTotalTransport: number;
  outSum: number;
  outCost: number;
  outVatSum: number;
  outPaySum: number;
  outTotalQty: number;
  outTotalTransport: number;
  doubledSum: number;
  quarter: {
    CLEARON: Array<{ productName: string; buyers: Record<string, number> }>;
    FLOTRON: Array<{ productName: string; buyers: Record<string, number> }>;
    FERROFORM: Array<{ productName: string; buyers: Record<string, number> }>;
    clearonCompanies: string[];
    flotronCompanies: string[];
    ferroformCompanies: string[];
  } | null;
};

export type MonthReportResponse =
  | Type0Report
  | Type1Report
  | Type2Report
  | Type3Report;

export type UpdateMonthDataPayload = {
  month: string;
  operatingOutgoings: number;
  process?: number;
  factVatReturn?: number | null;
};
