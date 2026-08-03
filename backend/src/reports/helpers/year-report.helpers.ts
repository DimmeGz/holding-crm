import { round3 } from './round.helpers';
import {
  YearMonthRow,
  YearMonthViewType0,
  YearMonthViewType1,
  YearMonthViewType3,
  YearQuarterType0,
  YearQuarterType1,
  YearQuarterType3,
  YearQuarters,
  YearReportTotals,
} from '../types/year-report.types';

const YTD_RANGES = {
  first: [1, 2, 3],
  second: [1, 2, 3, 4, 5, 6],
  third: [1, 2, 3, 4, 5, 6, 7, 8, 9],
  fourth: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
} as const;

export function resolveYear(date?: string): number {
  if (date && /^\d{4}$/.test(date)) {
    return Number(date);
  }
  return new Date().getFullYear();
}

export function yearMonthBounds(year: number): { from: string; to: string } {
  return {
    from: `${year}-01-01`,
    to: `${year}-12-01`,
  };
}

export function nextJanuaryFirst(year: number): string {
  return `${year + 1}-01-01`;
}

export function monthNumberFromDate(month: string): number {
  // Accepts YYYY-MM-01 or YYYY-MM
  const parts = month.split('-');
  return Number(parts[1]);
}

export function cashflowPreviousFromRows(
  rows: Pick<YearMonthRow, 'cashflow'>[],
): number {
  let previous = 0;
  for (const row of rows) {
    if (row.cashflow) {
      previous = Number(row.cashflow);
    }
  }
  return previous;
}

function emptyQuarterType0(): YearQuarterType0 {
  return {
    total: 0,
    commission: 0,
    inSum: 0,
    inTransport: 0,
    debt: 0,
    suplCredit: 0,
    comCredit: 0,
    delta: 0,
    operatingOutgoings: 0,
    profit: 0,
  };
}

function emptyQuarterType1(): YearQuarterType1 {
  return {
    total: 0,
    inSum: 0,
    inTransport: 0,
    debt: 0,
    suplCredit: 0,
    vat: 0,
    profit: 0,
    operatingOutgoings: 0,
  };
}

function emptyQuarterType3(): YearQuarterType3 {
  return {
    ...emptyQuarterType1(),
    vatReturn: 0,
    warehouse: 0,
    delta: 0,
  };
}

export function aggregateType0Quarter(
  rows: YearMonthRow[],
  months: readonly number[],
): YearQuarterType0 {
  const result = emptyQuarterType0();
  for (const row of rows) {
    if (!months.includes(row.monthNumber)) {
      continue;
    }
    result.total += row.outPay;
    result.commission += row.commissionPay;
    result.inSum += row.inPay;
    result.inTransport += row.outTransport;
    result.operatingOutgoings += row.operatingOutgoings;
    result.debt += row.outSum - row.outPay;
    result.suplCredit += row.inSum - row.inPay;
    result.comCredit += row.commissionLeft;
    result.delta += row.delta;
    result.profit += row.delta - row.commission;
  }
  return result;
}

export function aggregateType1Quarter(
  rows: YearMonthRow[],
  months: readonly number[],
): YearQuarterType1 {
  const result = emptyQuarterType1();
  for (const row of rows) {
    if (!months.includes(row.monthNumber)) {
      continue;
    }
    const transport = row.inTransport + row.outTransport;
    result.total += row.outPay;
    result.inSum += row.inPay;
    result.inTransport += transport;
    result.operatingOutgoings += row.operatingOutgoings;
    result.debt += row.outSum + row.outVat - row.outPay;
    result.suplCredit += row.inSum + row.inVat - row.inPay;
    result.vat += row.outVat - row.inVat;
    result.profit += row.outSum - row.inSum;
  }
  return result;
}

export function aggregateType3Quarter(
  rows: YearMonthRow[],
  months: readonly number[],
): YearQuarterType3 {
  const result = emptyQuarterType3();
  for (const row of rows) {
    if (!months.includes(row.monthNumber)) {
      continue;
    }
    const transport = row.inTransport + row.outTransport;
    const vatReturn = Number(row.vatReturn) || 0;
    result.total += row.outPay;
    result.inSum += row.inPay;
    result.inTransport += transport;
    result.operatingOutgoings += row.operatingOutgoings;
    result.debt += row.outSum + row.outVat - row.outPay;
    result.suplCredit += row.inSum + row.inVat - row.inPay;
    result.vat += row.outVat - row.inVat;
    result.delta += row.delta;
    result.vatReturn += vatReturn;
    if (row.warehouse) {
      result.warehouse = Number(row.warehouse);
    }
  }
  return result;
}

export function buildType0Quarters(
  rows: YearMonthRow[],
): YearQuarters<YearQuarterType0> {
  return {
    first: aggregateType0Quarter(rows, YTD_RANGES.first),
    second: aggregateType0Quarter(rows, YTD_RANGES.second),
    third: aggregateType0Quarter(rows, YTD_RANGES.third),
    fourth: aggregateType0Quarter(rows, YTD_RANGES.fourth),
  };
}

export function buildType1Quarters(
  rows: YearMonthRow[],
): YearQuarters<YearQuarterType1> {
  return {
    first: aggregateType1Quarter(rows, YTD_RANGES.first),
    second: aggregateType1Quarter(rows, YTD_RANGES.second),
    third: aggregateType1Quarter(rows, YTD_RANGES.third),
    fourth: aggregateType1Quarter(rows, YTD_RANGES.fourth),
  };
}

export function buildType3Quarters(
  rows: YearMonthRow[],
): YearQuarters<YearQuarterType3> {
  return {
    first: aggregateType3Quarter(rows, YTD_RANGES.first),
    second: aggregateType3Quarter(rows, YTD_RANGES.second),
    third: aggregateType3Quarter(rows, YTD_RANGES.third),
    fourth: aggregateType3Quarter(rows, YTD_RANGES.fourth),
  };
}

export function computeType0Finals(
  fourth: YearQuarterType0,
  cashflowPrevious: number,
): {
  cashflow: number;
  capitalization: number;
  total: YearReportTotals;
  yearDelta: number;
} {
  const capitalization = round3(
    cashflowPrevious + fourth.profit - fourth.operatingOutgoings,
  );
  const cashflow = round3(
    fourth.total +
      cashflowPrevious -
      fourth.commission -
      fourth.inSum -
      fourth.inTransport -
      fourth.operatingOutgoings,
  );
  return {
    cashflow,
    capitalization,
    total: {
      sales: round3(fourth.total + fourth.debt),
      buy: round3(fourth.inSum + fourth.suplCredit),
    },
    yearDelta: fourth.delta,
  };
}

export function computeType1Finals(
  fourth: YearQuarterType1,
  cashflowPrevious: number,
): {
  cashflow: number;
  capitalization: number;
  total: YearReportTotals;
  yearDelta: number;
} {
  const cashflow = round3(
    fourth.total +
      cashflowPrevious -
      fourth.inSum -
      fourth.inTransport -
      fourth.operatingOutgoings,
  );
  const capitalization = round3(cashflow + fourth.profit);
  return {
    cashflow,
    capitalization,
    total: {
      sales: round3(fourth.total + fourth.debt),
      buy: round3(fourth.inSum + fourth.suplCredit),
    },
    yearDelta: fourth.profit,
  };
}

export function computeType3Finals(
  fourth: YearQuarterType3,
  cashflowPrevious: number,
): {
  cashflow: number;
  capitalization: number;
  total: YearReportTotals;
  yearDelta: number;
} {
  const cashflow = round3(
    fourth.total +
      cashflowPrevious -
      fourth.inSum -
      fourth.inTransport -
      fourth.operatingOutgoings +
      fourth.vatReturn,
  );
  const capitalization = round3(
    cashflow + fourth.debt - fourth.suplCredit + fourth.warehouse,
  );
  return {
    cashflow,
    capitalization,
    total: {
      sales: round3(fourth.total + fourth.debt),
      buy: round3(fourth.inSum + fourth.suplCredit),
    },
    yearDelta: fourth.delta,
  };
}

export function mapType0MonthViews(rows: YearMonthRow[]): YearMonthViewType0[] {
  return rows.map((row) => {
    const debt = row.outSum - row.outPay;
    const suplCredit = row.inSum - row.inPay;
    return {
      month: row.month,
      monthNumber: row.monthNumber,
      outPay: row.outPay,
      commissionPay: row.commissionPay,
      inPay: row.inPay,
      outTransport: row.outTransport,
      operatingOutgoings: row.operatingOutgoings,
      debt,
      suplCredit,
      commissionLeft: row.commissionLeft,
      saldo: debt - suplCredit - row.commissionLeft,
      delta: row.delta,
      profit: row.delta - row.commission,
    };
  });
}

export function mapType1MonthViews(rows: YearMonthRow[]): YearMonthViewType1[] {
  return rows.map((row) => {
    const transport = row.inTransport + row.outTransport;
    const debt = row.outSum + row.outVat - row.outPay;
    const suplCredit = row.inSum + row.inVat - row.inPay;
    return {
      month: row.month,
      monthNumber: row.monthNumber,
      outPay: row.outPay,
      inPay: row.inPay,
      transport,
      operatingOutgoings: row.operatingOutgoings,
      vat: row.outVat - row.inVat,
      debt,
      suplCredit,
      saldo: row.outPay - row.inPay - transport - row.operatingOutgoings,
      profit: row.outSum - row.inSum,
      outSum: row.outSum,
      inSum: row.inSum,
    };
  });
}

export function mapType3MonthViews(rows: YearMonthRow[]): YearMonthViewType3[] {
  return rows.map((row) => {
    const transport = row.inTransport + row.outTransport;
    const debt = row.outSum + row.outVat - row.outPay;
    const suplCredit = row.inSum + row.inVat - row.inPay;
    const vatReturn = Number(row.vatReturn) || 0;
    return {
      month: row.month,
      monthNumber: row.monthNumber,
      outPay: row.outPay,
      inPay: row.inPay,
      transport,
      operatingOutgoings: row.operatingOutgoings,
      vatReturn,
      isVatFact: Boolean(row.isVatFact),
      vat: row.outVat - row.inVat,
      debt,
      suplCredit,
      saldo: debt - suplCredit,
      profit: row.delta,
      delta: row.delta,
    };
  });
}
