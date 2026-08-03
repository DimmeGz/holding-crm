import { CompanyType } from '../companies/enums';

export type CalendarCompanyLike = {
  id: number;
  name: string;
  companyType: CompanyType | string;
  calendarHex?: string | null;
};

export type CalendarOrderLineLike = {
  qty: number;
  productBuy?: { name?: string | null } | null;
};

export function getMonthRange(
  year: number,
  month: number,
): { start: string; end: string } {
  const monthStr = String(month).padStart(2, '0');
  const start = `${year}-${monthStr}-01`;
  const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const end = `${year}-${monthStr}-${String(lastDay).padStart(2, '0')}`;
  return { start, end };
}

function formatYmd(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

/**
 * Normalize PG `date` / ISO values to YYYY-MM-DD without TZ day-shift.
 * - strings: take leading calendar date
 * - Date at UTC midnight (common TypeORM parse): use UTC parts
 * - Date at local midnight (node-pg DATE parser): use local parts
 */
export function toDateString(
  value: Date | string | null | undefined,
): string | null {
  if (value == null) {
    return null;
  }

  if (typeof value === 'string') {
    const match = /^(\d{4}-\d{2}-\d{2})/.exec(value);
    return match?.[1] ?? null;
  }

  const isUtcMidnight =
    value.getUTCHours() === 0 &&
    value.getUTCMinutes() === 0 &&
    value.getUTCSeconds() === 0 &&
    value.getUTCMilliseconds() === 0;

  if (isUtcMidnight) {
    return formatYmd(
      value.getUTCFullYear(),
      value.getUTCMonth() + 1,
      value.getUTCDate(),
    );
  }

  return formatYmd(
    value.getFullYear(),
    value.getMonth() + 1,
    value.getDate(),
  );
}

export function todayDateString(now: Date = new Date()): string {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function resolveEffectiveDate(
  confirmExpectedDate: Date | string | null | undefined,
  expectedDate: Date | string | null | undefined,
): string | null {
  return toDateString(confirmExpectedDate) ?? toDateString(expectedDate);
}

export function normalizeCalendarHex(
  hex: string | null | undefined,
): string | null {
  if (!hex) {
    return null;
  }

  const trimmed = hex.trim();
  if (!trimmed) {
    return null;
  }

  return trimmed.startsWith('#') ? trimmed : `#${trimmed}`;
}

export function resolveCalendarHex(
  seller: CalendarCompanyLike,
  buyer: CalendarCompanyLike,
): string | null {
  if (seller.companyType !== CompanyType.INNER_COMPANY) {
    return normalizeCalendarHex(seller.calendarHex);
  }

  if (buyer.companyType !== CompanyType.INNER_COMPANY) {
    return normalizeCalendarHex(buyer.calendarHex);
  }

  return null;
}

export function buildProductSummary(lines: CalendarOrderLineLike[]): {
  productSummary: string;
  tooltipLines: string[];
} {
  if (!lines.length) {
    return { productSummary: '', tooltipLines: [] };
  }

  const distinctNames = [
    ...new Set(
      lines
        .map((line) => line.productBuy?.name?.trim())
        .filter((name): name is string => Boolean(name)),
    ),
  ];

  if (distinctNames.length === 1) {
    return {
      productSummary: `${distinctNames[0]} - ${lines[0].qty} кг`,
      tooltipLines: [],
    };
  }

  if (distinctNames.length > 1) {
    const sumQty = lines.reduce((acc, line) => acc + (Number(line.qty) || 0), 0);
    return {
      productSummary: `groupage cargo - ${sumQty} кг`,
      tooltipLines: lines.map(
        (line) => `${line.productBuy?.name ?? ''} - ${line.qty} кг`,
      ),
    };
  }

  return { productSummary: '', tooltipLines: [] };
}

export function isCurrentMonth(
  year: number,
  month: number,
  now: Date = new Date(),
): boolean {
  return now.getFullYear() === year && now.getMonth() + 1 === month;
}
