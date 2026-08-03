export type YearReportCompanyRef = {
  id: number;
  name: string;
  reportType: number;
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

type YearReportSupportedBase = {
  company: YearReportCompanyRef;
  year: number;
  supported: true;
  cashflowPrevious: number;
  cashflow: number;
  capitalization: number;
  total: { sales: number; buy: number };
  savedCashflow: number;
  yearDelta: number;
};

export type YearReportUnsupported = {
  company: YearReportCompanyRef;
  year: number;
  reportType: 2;
  supported: false;
};

export type YearReportType0 = YearReportSupportedBase & {
  reportType: 0;
  months: YearMonthViewType0[];
  quarters: YearQuarters<YearQuarterType0>;
};

export type YearReportType1 = YearReportSupportedBase & {
  reportType: 1;
  months: YearMonthViewType1[];
  quarters: YearQuarters<YearQuarterType1>;
  totalWareAmount: number;
};

export type YearReportType3 = YearReportSupportedBase & {
  reportType: 3;
  months: YearMonthViewType3[];
  quarters: YearQuarters<YearQuarterType3>;
  totalWareAmount: number;
};

export type YearReportResponse =
  | YearReportUnsupported
  | YearReportType0
  | YearReportType1
  | YearReportType3;

export type SaveCashflowPayload = {
  year: number;
  amount: number;
};
