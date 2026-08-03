import { useApiData } from '@/hooks/useApiData';
import { ReportsService } from '@/services/reports/reports.service';
import type { MonthReportResponse } from '@/types/reports/month-report.types';

export function useMonthReport(
  companyId: number,
  date: string,
  process: number | null,
): {
  data: MonthReportResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
} {
  return useApiData<MonthReportResponse>(
    () =>
      ReportsService.getMonthReport(companyId, {
        date,
        ...(process ? { process } : {}),
      }),
    {
      enabled: Number.isFinite(companyId) && companyId > 0 && Boolean(date),
      dependencies: [companyId, date, process],
    },
  );
}
