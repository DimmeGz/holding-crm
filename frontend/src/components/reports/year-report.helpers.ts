import dayjs from 'dayjs';
import 'dayjs/locale/uk';
import 'dayjs/locale/cs';

export const YEAR_BLOCKS = [
  { key: 'first' as const, months: [1, 2, 3], ytdLabelKey: 'ytd3' as const },
  { key: 'second' as const, months: [4, 5, 6], ytdLabelKey: 'ytd6' as const },
  { key: 'third' as const, months: [7, 8, 9], ytdLabelKey: 'ytd9' as const },
  {
    key: 'fourth' as const,
    months: [10, 11, 12],
    ytdLabelKey: 'ytd12' as const,
  },
];

export function yearList(fromYear = 2022): number[] {
  const current = new Date().getFullYear();
  const years: number[] = [];
  for (let y = fromYear; y <= current; y += 1) {
    years.push(y);
  }
  return years;
}

export function monthLabel(month: string, language: string): string {
  const locale = language.startsWith('cz') || language.startsWith('cs')
    ? 'cs'
    : 'uk';
  return dayjs(month.slice(0, 10)).locale(locale).format('MMMM');
}

export function monthToYearMonth(month: string): string {
  return month.slice(0, 7);
}

export function formatAmount(value: number): string {
  return String(value);
}

export function quarterDelta(
  current: number,
  previous: number | null,
): number {
  if (previous === null) {
    return current;
  }
  return current - previous;
}
