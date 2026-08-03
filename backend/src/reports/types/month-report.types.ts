import { MonthDataSnapshot } from '../helpers';

export enum ReportTypeEnum {
  TYPE_0 = 0,
  TYPE_1 = 1,
  TYPE_2 = 2,
  TYPE_3 = 3,
}

export type ReportPaymentRef = {
  id: number;
  date: string | Date | null;
  sum: number;
};

export type ReportCompanyRef = {
  id: number;
  name: string;
  reportType: number;
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

export type MonthReportBase = {
  company: ReportCompanyRef;
  date: string;
  process: number | null;
  monthData: MonthDataBlock;
};

export type Type0Row = {
  orderIds: number[];
  orderNumbers: string[];
  seller: { id: number; name: string } | null;
  inInvoice: {
    id: number;
    number: string;
    expectedDate: string | Date | null;
    reportPeriod: string | Date | null;
  };
  inInvoiceSum: number;
  inPayments: ReportPaymentRef[];
  inPaymentSum: number;
  outInvoices: Array<{
    id: number;
    number: string;
    expectedDate: string | Date | null;
    buyer: { id: number; name: string } | null;
  }>;
  outInvoiceSum: number;
  outTransportSum: number;
  outPayments: ReportPaymentRef[];
  outPaymentSum: number;
  commission: {
    id: number;
    documentSum: number;
    rate: number;
  } | null;
  comSum: number;
  comPayments: ReportPaymentRef[];
  comPaymentsSum: number;
  qty: number;
  delta: number;
};

export type Type0Totals = {
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

export type Type0Report = MonthReportBase & {
  reportType: ReportTypeEnum.TYPE_0;
  lines: Type0Row[];
  totals: Type0Totals;
};

export type Type1InvoiceRow = {
  invoice: {
    id: number;
    number: string;
    expectedDate: string | Date | null;
    reportPeriod: string | Date | null;
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

export type Type1Report = MonthReportBase & {
  reportType: ReportTypeEnum.TYPE_1;
  incomes: Type1InvoiceRow[];
  outgoings: Type1InvoiceRow[];
  incomeTotal: Type1SideTotals;
  outgoingTotal: Type1SideTotals;
};

export type Type2ProductRow = {
  productId: number;
  productName: string;
  qty: number;
  sum: number;
};

export type Type2Report = MonthReportBase & {
  reportType: ReportTypeEnum.TYPE_2;
  incomes: Type2ProductRow[];
  outgoings: Type2ProductRow[];
  inQty: number;
  inSum: number;
  outQty: number;
  outSum: number;
};

export type Type3LineRow = {
  lineId: number;
  invoiceId: number;
  invoiceNumber: string;
  expectedDate: string | Date | null;
  reportPeriod: string | Date | null;
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

export type Type3QuarterGroup = {
  productName: string;
  buyers: Record<string, number>;
};

export type Type3Report = MonthReportBase & {
  reportType: ReportTypeEnum.TYPE_3;
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
    CLEARON: Type3QuarterGroup[];
    FLOTRON: Type3QuarterGroup[];
    FERROFORM: Type3QuarterGroup[];
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
