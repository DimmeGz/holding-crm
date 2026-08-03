import {
  aggregateType0Quarter,
  aggregateType3Quarter,
  cashflowPreviousFromRows,
  computeType0Finals,
  computeType1Finals,
  computeType3Finals,
  nextJanuaryFirst,
  resolveYear,
  yearMonthBounds,
} from './year-report.helpers';
import { YearMonthRow } from '../types/year-report.types';

function row(partial: Partial<YearMonthRow> & { monthNumber: number }): YearMonthRow {
  return {
    month: `2024-${String(partial.monthNumber).padStart(2, '0')}-01`,
    outPay: 0,
    inPay: 0,
    outSum: 0,
    inSum: 0,
    outVat: 0,
    inVat: 0,
    outTransport: 0,
    inTransport: 0,
    commission: 0,
    commissionPay: 0,
    commissionLeft: 0,
    delta: 0,
    operatingOutgoings: 0,
    cashflow: 0,
    warehouse: 0,
    factVatReturn: null,
    ...partial,
  };
}

describe('year-report helpers', () => {
  describe('resolveYear / bounds / nextJanuary', () => {
    it('resolves YYYY and defaults to current year', () => {
      expect(resolveYear('2024')).toBe(2024);
      expect(resolveYear()).toBe(new Date().getFullYear());
    });

    it('builds year bounds and next January', () => {
      expect(yearMonthBounds(2024)).toEqual({
        from: '2024-01-01',
        to: '2024-12-01',
      });
      expect(nextJanuaryFirst(2024)).toBe('2025-01-01');
    });
  });

  describe('cashflowPreviousFromRows', () => {
    it('takes last truthy cashflow in ordered list', () => {
      expect(
        cashflowPreviousFromRows([
          { cashflow: 100 },
          { cashflow: 0 },
          { cashflow: 50 },
        ]),
      ).toBe(50);
      expect(cashflowPreviousFromRows([{ cashflow: 0 }])).toBe(0);
    });
  });

  describe('type 0', () => {
    it('aggregates YTD quarter and finals like Django', () => {
      const rows = [
        row({
          monthNumber: 1,
          outPay: 100,
          commissionPay: 10,
          inPay: 40,
          outTransport: 5,
          operatingOutgoings: 3,
          outSum: 120,
          inSum: 50,
          commissionLeft: 2,
          delta: 30,
          commission: 8,
          cashflow: 200,
        }),
        row({
          monthNumber: 4,
          outPay: 50,
          commissionPay: 5,
          inPay: 20,
          outTransport: 2,
          operatingOutgoings: 1,
          outSum: 60,
          inSum: 25,
          commissionLeft: 1,
          delta: 15,
          commission: 4,
        }),
      ];

      const first = aggregateType0Quarter(rows, [1, 2, 3]);
      expect(first.total).toBe(100);
      expect(first.profit).toBe(22); // 30 - 8
      expect(first.debt).toBe(20); // 120 - 100

      const fourth = aggregateType0Quarter(
        rows,
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      );
      expect(fourth.total).toBe(150);
      expect(fourth.operatingOutgoings).toBe(4);

      const prev = cashflowPreviousFromRows(rows);
      const finals = computeType0Finals(fourth, prev);
      // cashflow = 150 + 200 - 15 - 60 - 7 - 4 = 264
      expect(finals.cashflow).toBe(264);
      // capitalization = 200 + (45-12) - 4 = 229
      expect(finals.capitalization).toBe(229);
      expect(finals.yearDelta).toBe(45);
      expect(finals.total.sales).toBe(180); // 150 + 30
      expect(finals.total.buy).toBe(75); // 60 + 15
    });
  });

  describe('type 1', () => {
    it('computes cashflow and capitalization from profit', () => {
      const fourth = {
        total: 100,
        inSum: 40,
        inTransport: 10,
        debt: 20,
        suplCredit: 5,
        vat: 1,
        profit: 30,
        operatingOutgoings: 8,
      };
      const finals = computeType1Finals(fourth, 50);
      // cashflow = 100 + 50 - 40 - 10 - 8 = 92
      expect(finals.cashflow).toBe(92);
      expect(finals.capitalization).toBe(122);
      expect(finals.yearDelta).toBe(30);
    });
  });

  describe('type 3', () => {
    it('adds vatReturn to cashflow and warehouse to capitalization', () => {
      const rows = [
        row({
          monthNumber: 1,
          outPay: 100,
          inPay: 40,
          inTransport: 2,
          outTransport: 3,
          operatingOutgoings: 5,
          outSum: 110,
          outVat: 10,
          inSum: 45,
          inVat: 5,
          delta: 12,
          vatReturn: 7,
          warehouse: 0,
        }),
        row({
          monthNumber: 6,
          outPay: 0,
          warehouse: 25,
          vatReturn: 0,
        }),
      ];
      const fourth = aggregateType3Quarter(
        rows,
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      );
      expect(fourth.warehouse).toBe(25);
      expect(fourth.vatReturn).toBe(7);
      expect(fourth.inTransport).toBe(5); // 2+3

      const finals = computeType3Finals(fourth, 10);
      // cashflow = 100 + 10 - 40 - 5 - 5 + 7 = 67
      expect(finals.cashflow).toBe(67);
      // capitalization = 67 + debt - supl + 25
      // debt = (110+10-100) = 20; supl = (45+5-40) = 10
      expect(finals.capitalization).toBe(102);
      expect(finals.yearDelta).toBe(12);
    });
  });
});
