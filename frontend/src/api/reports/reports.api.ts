import { apiClient } from '@/api/api-client';
import type {
  MonthReportResponse,
  UpdateMonthDataPayload,
} from '@/types/reports/month-report.types';

export type MonthReportQuery = {
  date?: string;
  process?: number;
};

function buildQuery(query?: MonthReportQuery): string {
  const params = new URLSearchParams();
  if (query?.date) {
    params.set('date', query.date);
  }
  if (query?.process) {
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

  saveMonthData(
    companyId: number,
    payload: UpdateMonthDataPayload,
  ): Promise<unknown> {
    return apiClient.patch(`/reports/month-data/${companyId}`, payload);
  },
};
