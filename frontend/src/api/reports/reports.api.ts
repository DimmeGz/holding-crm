import { apiClient } from '@/api/api-client';
import type {
  MonthReportResponse,
  UpdateMonthDataPayload,
} from '@/types/reports/month-report.types';
import type { ProductionReportResponse } from '@/types/reports/production-report.types';
import type { TechnoReportResponse } from '@/types/reports/techno-report.types';
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

export type TechnoReportQuery = {
  startDate?: string;
  endDate?: string;
  process: number;
};

function buildQuery(
  query?: MonthReportQuery | YearReportQuery | TechnoReportQuery,
): string {
  const params = new URLSearchParams();
  if (query && 'date' in query && query.date) {
    params.set('date', query.date);
  }
  if (query && 'startDate' in query && query.startDate) {
    params.set('startDate', query.startDate);
  }
  if (query && 'endDate' in query && query.endDate) {
    params.set('endDate', query.endDate);
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

  exportMonthReport(
    companyId: number,
    query?: MonthReportQuery,
  ): Promise<{ blob: Blob; filename: string | null }> {
    return apiClient.getBlob(
      `/reports/month-report/${companyId}/export${buildQuery(query)}`,
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

  getProductionReport(
    companyId: number,
    query?: MonthReportQuery,
  ): Promise<ProductionReportResponse> {
    return apiClient.get<ProductionReportResponse>(
      `/reports/production-report/${companyId}${buildQuery(query)}`,
    );
  },

  getTechnoReport(query: TechnoReportQuery): Promise<TechnoReportResponse> {
    return apiClient.get<TechnoReportResponse>(
      `/reports/techno-report${buildQuery(query)}`,
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
