import {
  reportsApi,
  type MonthReportQuery,
  type TechnoReportQuery,
  type YearReportQuery,
} from '@/api/reports/reports.api';
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

function triggerBlobDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export const ReportsService = {
  getMonthReport(
    companyId: number,
    query?: MonthReportQuery,
  ): Promise<MonthReportResponse> {
    return reportsApi.getMonthReport(companyId, query);
  },

  async exportMonthReport(
    companyId: number,
    query?: MonthReportQuery,
  ): Promise<void> {
    const { blob, filename } = await reportsApi.exportMonthReport(
      companyId,
      query,
    );
    triggerBlobDownload(
      blob,
      filename ?? `month-report-${companyId}.csv`,
    );
  },

  getYearReport(
    companyId: number,
    query?: YearReportQuery,
  ): Promise<YearReportResponse> {
    return reportsApi.getYearReport(companyId, query);
  },

  getProductionReport(
    companyId: number,
    query?: MonthReportQuery,
  ): Promise<ProductionReportResponse> {
    return reportsApi.getProductionReport(companyId, query);
  },

  getTechnoReport(query: TechnoReportQuery): Promise<TechnoReportResponse> {
    return reportsApi.getTechnoReport(query);
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
