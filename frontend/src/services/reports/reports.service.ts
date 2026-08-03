import { reportsApi, type MonthReportQuery } from '@/api/reports/reports.api';
import type {
  MonthReportResponse,
  UpdateMonthDataPayload,
} from '@/types/reports/month-report.types';

export const ReportsService = {
  getMonthReport(
    companyId: number,
    query?: MonthReportQuery,
  ): Promise<MonthReportResponse> {
    return reportsApi.getMonthReport(companyId, query);
  },

  saveMonthData(
    companyId: number,
    payload: UpdateMonthDataPayload,
  ): Promise<unknown> {
    return reportsApi.saveMonthData(companyId, payload);
  },
};
