import { apiClient } from '@/api/api-client';
import type {
  MonthReportResponse,
  UpdateMonthDataPayload,
} from '@/types/reports/month-report.types';
import type {
  SaveCashflowPayload,
  YearReportResponse,
} from '@/types/reports/year-report.types';

export type MonthReportQuery = {
  date?: string;
  process?: number;
};

export type YearReportQuery = {
  date?: string;
};

function buildQuery(
  query?: MonthReportQuery | YearReportQuery,
): string {
  const params = new URLSearchParams();
  if (query?.date) {
    params.set('date', query.date);
  }
  if (query && 'process' in query && query.process) {
    params.set('process', String(query.process));
  }
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export const reportsApi = {
  getMonthReport(
    companyId: number,
    query?: MonthReportQuery,
  ): Promise<MonthReportResponse> {
    return apiClient.get<MonthReportResponse>(
      `/reports/month-report/${companyId}${buildQuery(query)}`,
    );
  },

  getYearReport(
    companyId: number,
    query?: YearReportQuery,
  ): Promise<YearReportResponse> {
    return apiClient.get<YearReportResponse>(
      `/reports/year-report/${companyId}${buildQuery(query)}`,
    );
  },

  saveMonthData(
    companyId: number,
    payload: UpdateMonthDataPayload,
  ): Promise<unknown> {
    return apiClient.patch(`/reports/month-data/${companyId}`, payload);
  },

  saveCashflow(
    companyId: number,
    payload: SaveCashflowPayload,
  ): Promise<unknown> {
    return apiClient.patch(
      `/reports/month-data/${companyId}/cashflow`,
      payload,
    );
  },
};