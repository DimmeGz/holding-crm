import { round3, proportionalAmount, safeProportion } from './index';
import {
  computeCountVatReturn,
  emptySnapshot,
  snapshotFromType0,
  snapshotFromType2,
  snapshotFromType3,
} from './month-data-snapshot.helpers';
import { commissionSnapshotFromRate } from '../builders/report-type-0.builder';
import {
  resolveReportDate,
  shiftMonth,
  isQuarterEndMonth,
} from './report-period.helpers';

describe('report helpers', () => {
  describe('round3', () => {
    it('rounds to 3 decimal places like Django', () => {
      expect(round3(1.2344)).toBe(1.234);
      expect(round3(1.2345)).toBe(1.235);
      expect(round3(10 * 0.1)).toBe(1);
    });
  });

  describe('proportions', () => {
    it('safeProportion returns 1 when whole is 0', () => {
      expect(safeProportion(5, 0)).toBe(1);
    });

    it('proportionalAmount rounds to 3 dp', () => {
      expect(proportionalAmount(100, 1, 3)).toBe(33.333);
    });

    it('type 3 pay/transport proportions match Django-style splits', () => {
      const lineAmount = 40;
      const invoiceSum = 100;
      const documentSum = 120;
      const transportAmount = 30;
      const paymentAmount = 60;

      const transport = proportionalAmount(
        transportAmount,
        lineAmount,
        invoiceSum,
      );
      const pay = proportionalAmount(paymentAmount, lineAmount, documentSum);

      expect(transport).toBe(12);
      expect(pay).toBe(20);
    });
  });

  describe('report period', () => {
    it('defaults date to current YYYY-MM when omitted', () => {
      const now = new Date();
      const expected = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      expect(resolveReportDate()).toBe(expected);
    });

    it('shifts months and detects quarter end', () => {
      expect(shiftMonth('2026-03', -2)).toBe('2026-01');
      expect(isQuarterEndMonth('2026-03')).toBe(true);
      expect(isQuarterEndMonth('2026-02')).toBe(false);
    });
  });

  describe('countVatReturn', () => {
    it('returns null when prior MonthData is missing', () => {
      expect(computeCountVatReturn(null)).toBeNull();
      expect(computeCountVatReturn(undefined)).toBeNull();
    });

    it('returns inVat - outVat when prior exists', () => {
      expect(computeCountVatReturn({ inVat: 50, outVat: 20 })).toBe(30);
      expect(computeCountVatReturn({ inVat: 10, outVat: 15 })).toBe(-5);
    });
  });

  describe('snapshots', () => {
    it('type 0 commission snapshot uses rate * out / 100 not document_sum', () => {
      expect(commissionSnapshotFromRate(10, 200)).toBe(20);
      const snap = snapshotFromType0({
        qty: 1,
        inSum: 100,
        inPaySum: 50,
        outSum: 200,
        outPaySum: 80,
        outTransportSum: 5,
        comSum: commissionSnapshotFromRate(10, 200),
        comPaySum: 5,
        comLeftSum: 15,
        delta: 95,
      });
      expect(snap.commission).toBe(20);
      expect(snap.commission).not.toBe(999);
    });

    it('type 2 snapshot keeps only in/out qty/sum', () => {
      const snap = snapshotFromType2({
        inQty: 2,
        inSum: 10,
        outQty: 3,
        outSum: 15,
      });
      expect(snap).toEqual({
        ...emptySnapshot(),
        inQty: 2,
        inSum: 10,
        outQty: 3,
        outSum: 15,
      });
    });

    it('type 3 snapshot delta uses out - cost - transport - doubled', () => {
      const snap = snapshotFromType3({
        inTotalQty: 1,
        inSum: 10,
        inVatSum: 2,
        inTotalTransport: 1,
        inPaySum: 5,
        outTotalQty: 2,
        outSum: 100,
        outVatSum: 3,
        outTotalTransport: 10,
        outPaySum: 40,
        outCost: 20,
        doubledSum: 5,
      });
      expect(snap.delta).toBe(65);
    });
  });
});
