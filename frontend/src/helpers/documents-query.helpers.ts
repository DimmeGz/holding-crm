import type { GetOrdersQuery } from '@/types/documents/orders.types';

export type DocumentTypeParam = 'buy' | 'sel';
export type ContractTypeParam = DocumentTypeParam | 'inner';
export type OrderStatusUrl = 'open' | 'closed' | 'all';

export type DocumentsQueryParams = {
  company?: number;
  type?: string;
  process?: number;
  year?: number;
  date?: string;
  status?: boolean;
  hidden?: boolean;
  sellerId?: number;
  buyerId?: number;
  recipientId?: number;
  is_ship?: 'true' | 'false';
};

export type ContractsListQuery = {
  company?: number;
  type?: ContractTypeParam;
  process?: number;
};

export type DatedDocumentsListQuery = {
  company?: number;
  type?: DocumentTypeParam;
  date?: string;
};

export type PaymentsListQuery = {
  company?: number;
  type?: DocumentTypeParam;
};

export const ORDERS_YEAR_START = 2021;
export const QUARTERS_START_YEAR = 2022;

export function parsePositiveInt(value: string | null): number | undefined {
  if (!value) {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

export function parseDocumentType(
  value: string | null,
): DocumentTypeParam | undefined {
  return value === 'buy' || value === 'sel' ? value : undefined;
}

export function parseContractType(
  value: string | null,
): ContractTypeParam | undefined {
  if (value === 'inner') {
    return 'inner';
  }

  return parseDocumentType(value);
}

export function currentQuarterParam(now = new Date()): string {
  const year = now.getFullYear();
  const quarter = Math.floor(now.getMonth() / 3) + 1;
  return `${year}-${quarter}`;
}

export function getOrderYearsList(now = new Date()): number[] {
  const years: number[] = [];
  for (let year = now.getFullYear(); year >= ORDERS_YEAR_START; year -= 1) {
    years.push(year);
  }
  return years;
}

export function getQuarterYears(now = new Date()): number[] {
  const years: number[] = [];
  for (let year = now.getFullYear(); year >= QUARTERS_START_YEAR; year -= 1) {
    years.push(year);
  }
  return years;
}

export function getMaxQuarterForYear(year: number, now = new Date()): number {
  if (year === now.getFullYear()) {
    return Math.floor(now.getMonth() / 3) + 1;
  }
  return 4;
}

export function getQuartersForYear(year: number, now = new Date()): string[] {
  const maxQuarter = getMaxQuarterForYear(year, now);
  return Array.from(
    { length: maxQuarter },
    (_, index) => `${year}-${index + 1}`,
  );
}

/** Flat list kept for callers that need all quarters (newest year last). */
export function getQuartersList(now = new Date()): string[] {
  const quarters: string[] = [];
  for (const year of [...getQuarterYears(now)].reverse()) {
    quarters.push(...getQuartersForYear(year, now));
  }
  return quarters;
}

export function buildDocumentsQueryString(
  query?: DocumentsQueryParams,
): string {
  if (!query) {
    return '';
  }

  const params = new URLSearchParams();

  if (query.company !== undefined) {
    params.set('company', String(query.company));
  }

  if (query.type !== undefined) {
    params.set('type', query.type);
  }

  if (query.process !== undefined) {
    params.set('process', String(query.process));
  }

  if (query.year !== undefined) {
    params.set('year', String(query.year));
  }

  if (query.date !== undefined) {
    params.set('date', query.date);
  }

  if (query.status !== undefined) {
    params.set('status', String(query.status));
  }

  if (query.hidden !== undefined) {
    params.set('hidden', String(query.hidden));
  }

  if (query.sellerId !== undefined) {
    params.set('sellerId', String(query.sellerId));
  }

  if (query.buyerId !== undefined) {
    params.set('buyerId', String(query.buyerId));
  }

  if (query.recipientId !== undefined) {
    params.set('recipientId', String(query.recipientId));
  }

  if (query.is_ship !== undefined) {
    params.set('is_ship', query.is_ship);
  }

  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export function parseOrderListQuery(
  searchParams: URLSearchParams,
): GetOrdersQuery & { statusUrl: OrderStatusUrl } {
  const statusParam = searchParams.get('status');
  const yearParam = parsePositiveInt(searchParams.get('year'));
  const currentYear = new Date().getFullYear();
  const type = parseDocumentType(searchParams.get('type'));
  const process = parsePositiveInt(searchParams.get('process'));

  const base: GetOrdersQuery & { statusUrl: OrderStatusUrl } = {
    statusUrl: 'all',
    type,
    process,
  };

  if (statusParam === 'open' || statusParam === 'false') {
    return {
      ...base,
      statusUrl: 'open',
      status: false,
    };
  }

  if (statusParam === 'closed' || statusParam === 'true') {
    return {
      ...base,
      statusUrl: 'closed',
      status: true,
      year: yearParam ?? currentYear,
    };
  }

  return {
    ...base,
    statusUrl: 'all',
    year: yearParam ?? currentYear,
  };
}

export function toOrdersApiQuery(
  parsed: GetOrdersQuery & { statusUrl: OrderStatusUrl },
): GetOrdersQuery {
  const { statusUrl: _statusUrl, ...query } = parsed;
  return query;
}
