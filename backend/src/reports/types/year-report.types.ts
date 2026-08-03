import { ReportTypeEnum } from './month-report.types';

export type YearReportCompanyRef = {
  id: number;
  name: string;
  reportType: number;
};

export type YearMonthRow = {
  month: string;
  monthNumber: number;
  outPay: number;
  inPay: number;
  outSum: number;
  inSum: number;
  outVat: number;
  inVat: number;
  outTransport: number;
  inTransport: number;
  commission: number;
  commissionPay: number;
  commissionLeft: number;
  delta: number;
  operatingOutgoings: number;
  cashflow: number;
  warehouse: number;
  factVatReturn: number | null;
  /** Type 3: resolved VAT return for the month */
  vatReturn?: number;
  isVatFact?: boolean;
};

export type YearQuarterType0 = {
  total: number;
  commission: number;
  inSum: number;
  inTransport: number;
  debt: number;
  suplCredit: number;
  comCredit: number;
  delta: number;
  operatingOutgoings: number;
  profit: number;
};

export type YearQuarterType1 = {
  total: number;
  inSum: number;
  inTransport: number;
  debt: number;
  suplCredit: number;
  vat: number;
  profit: number;
  operatingOutgoings: number;
};

export type YearQuarterType3 = YearQuarterType1 & {
  vatReturn: number;
  warehouse: number;
  delta: number;
};

export type YearQuarters<T> = {
  first: T;
  second: T;
  third: T;
  fourth: T;
};

export type YearReportTotals = {
  sales: number;
  buy: number;
};

export type YearReportUnsupported = {
  company: YearReportCompanyRef;
  year: number;
  reportType: ReportTypeEnum.TYPE_2;
  supported: false;
};

export type YearReportSupportedBase = {
  company: YearReportCompanyRef;
  year: number;
  supported: true;
  cashflowPrevious: number;
  cashflow: number;
  capitalization: number;
  total: YearReportTotals;
  savedCashflow: number;
  yearDelta: number;
};

export type YearMonthViewType0 = {
  month: string;
  monthNumber: number;
  outPay: number;
  commissionPay: number;
  inPay: number;
  outTransport: number;
  operatingOutgoings: number;
  debt: number;
  suplCredit: number;
  commissionLeft: number;
  saldo: number;
  delta: number;
  profit: number;
};

export type YearMonthViewType1 = {
  month: string;
  monthNumber: number;
  outPay: number;
  inPay: number;
  transport: number;
  operatingOutgoings: number;
  vat: number;
  debt: number;
  suplCredit: number;
  saldo: number;
  profit: number;
  outSum: number;
  inSum: number;
};

export type YearMonthViewType3 = {
  month: string;
  monthNumber: number;
  outPay: number;
  inPay: number;
  transport: number;
  operatingOutgoings: number;
  vatReturn: number;
  isVatFact: boolean;
  vat: number;
  debt: number;
  suplCredit: number;
  saldo: number;
  profit: number;
  delta: number;
};

export type YearReportType0 = YearReportSupportedBase & {
  reportType: ReportTypeEnum.TYPE_0;
  months: YearMonthViewType0[];
  quarters: YearQuarters<YearQuarterType0>;
};

export type YearReportType1 = YearReportSupportedBase & {
  reportType: ReportTypeEnum.TYPE_1;
  months: YearMonthViewType1[];
  quarters: YearQuarters<YearQuarterType1>;
  totalWareAmount: number;
};

export type YearReportType3 = YearReportSupportedBase & {
  reportType: ReportTypeEnum.TYPE_3;
  months: YearMonthViewType3[];
  quarters: YearQuarters<YearQuarterType3>;
  totalWareAmount: number;
};

export type YearReportResponse =
  | YearReportUnsupported
  | YearReportType0
  | YearReportType1
  | YearReportType3;
