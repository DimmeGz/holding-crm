import {
  reportsApi,
  type MonthReportQuery,
  type YearReportQuery,
} from '@/api/reports/reports.api';
import type {
  MonthReportResponse,
  UpdateMonthDataPayload,
} from '@/types/reports/month-report.types';
import type {
  SaveCashflowPayload,
  YearReportResponse,
} from '@/types/reports/year-report.types';

export const ReportsService = {
  getMonthReport(
    companyId: number,
    query?: MonthReportQuery,
  ): Promise<MonthReportResponse> {
    return reportsApi.getMonthReport(companyId, query);
  },

  getYearReport(
    companyId: number,
    query?: YearReportQuery,
  ): Promise<YearReportResponse> {
    return reportsApi.getYearReport(companyId, query);
  },

  saveMonthData(
    companyId: number,
    payload: UpdateMonthDataPayload,
  ): Promise<unknown> {
    return reportsApi.saveMonthData(companyId, payload);
  },

  saveCashflow(
    companyId: number,
    payload: SaveCashflowPayload,
  ): Promise<unknown> {
    return reportsApi.saveCashflow(companyId, payload);
  },
};