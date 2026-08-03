import { getFirstAndLastDaysOfMonth } from '../../common/utils';
import { DatePeriodDTO } from '../../common/dto';

/** YYYY-MM; defaults to current month when omitted (parity with Django). */
export function resolveReportDate(date?: string): string {
  if (date) {
    return date;
  }
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${now.getFullYear()}-${month}`;
}

export function reportPeriodRange(date?: string): {
  date: string;
  period: DatePeriodDTO;
} {
  const resolved = resolveReportDate(date);
  return {
    date: resolved,
    period: getFirstAndLastDaysOfMonth(resolved),
  };
}

export function monthFirstDay(dateYYYYMM: string): string {
  return `${dateYYYYMM}-01`;
}

export function shiftMonth(dateYYYYMM: string, deltaMonths: number): string {
  const [year, month] = dateYYYYMM.split('-').map(Number);
  const d = new Date(year, month - 1 + deltaMonths, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export function isQuarterEndMonth(dateYYYYMM: string): boolean {
  const month = Number(dateYYYYMM.split('-')[1]);
  return month % 3 === 0;
}
