import { CompanyType } from '../companies/enums';
import {
  buildProductSummary,
  getMonthRange,
  isCurrentMonth,
  normalizeCalendarHex,
  resolveCalendarHex,
  resolveEffectiveDate,
  toDateString,
  todayDateString,
} from './calendar.utils';

describe('calendar.utils', () => {
  describe('getMonthRange', () => {
    it('returns inclusive month bounds', () => {
      expect(getMonthRange(2026, 8)).toEqual({
        start: '2026-08-01',
        end: '2026-08-31',
      });
      expect(getMonthRange(2024, 2)).toEqual({
        start: '2024-02-01',
        end: '2024-02-29',
      });
    });
  });

  describe('toDateString / resolveEffectiveDate', () => {
    it('prefers confirmExpectedDate over expectedDate', () => {
      expect(resolveEffectiveDate('2026-08-15', '2026-08-01')).toBe(
        '2026-08-15',
      );
      expect(resolveEffectiveDate(null, '2026-08-01')).toBe('2026-08-01');
      expect(resolveEffectiveDate(null, null)).toBeNull();
    });

    it('formats UTC-midnight Date via UTC parts', () => {
      expect(toDateString(new Date(Date.UTC(2026, 7, 3)))).toBe('2026-08-03');
    });

    it('formats local-midnight Date via local parts (no day shift)', () => {
      // Simulates node-pg DATE parser: local midnight for 2026-08-03
      expect(toDateString(new Date(2026, 7, 3, 0, 0, 0, 0))).toBe('2026-08-03');
    });

    it('parses ISO datetime strings by calendar prefix', () => {
      expect(toDateString('2026-08-03T00:00:00.000Z')).toBe('2026-08-03');
    });
  });


  describe('normalizeCalendarHex / resolveCalendarHex', () => {
    it('adds # prefix when missing', () => {
      expect(normalizeCalendarHex('aabbcc')).toBe('#aabbcc');
      expect(normalizeCalendarHex('#ff00aa')).toBe('#ff00aa');
      expect(normalizeCalendarHex(null)).toBeNull();
    });

    it('uses non-com seller first, otherwise buyer', () => {
      expect(
        resolveCalendarHex(
          {
            id: 1,
            name: 'Seller',
            companyType: CompanyType.BUYER,
            calendarHex: '112233',
          },
          {
            id: 2,
            name: 'Buyer',
            companyType: CompanyType.INNER_COMPANY,
            calendarHex: 'ffffff',
          },
        ),
      ).toBe('#112233');

      expect(
        resolveCalendarHex(
          {
            id: 1,
            name: 'Seller',
            companyType: CompanyType.INNER_COMPANY,
            calendarHex: '112233',
          },
          {
            id: 2,
            name: 'Buyer',
            companyType: CompanyType.BUYER,
            calendarHex: 'abcdef',
          },
        ),
      ).toBe('#abcdef');
    });
  });

  describe('buildProductSummary', () => {
    it('formats single product line', () => {
      expect(
        buildProductSummary([
          { qty: 500, productBuy: { name: 'Product X' } },
        ]),
      ).toEqual({
        productSummary: 'Product X - 500 кг',
        tooltipLines: [],
      });
    });

    it('formats groupage with tooltip lines', () => {
      expect(
        buildProductSummary([
          { qty: 100, productBuy: { name: 'A' } },
          { qty: 250, productBuy: { name: 'B' } },
        ]),
      ).toEqual({
        productSummary: 'groupage cargo - 350 кг',
        tooltipLines: ['A - 100 кг', 'B - 250 кг'],
      });
    });
  });

  describe('isCurrentMonth / todayDateString', () => {
    it('detects current month', () => {
      const now = new Date(2026, 7, 3);
      expect(isCurrentMonth(2026, 8, now)).toBe(true);
      expect(isCurrentMonth(2026, 7, now)).toBe(false);
      expect(todayDateString(now)).toBe('2026-08-03');
    });
  });
});
