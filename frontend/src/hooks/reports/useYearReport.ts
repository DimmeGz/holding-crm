import { useApiData } from '@/hooks/useApiData';
import { ReportsService } from '@/services/reports/reports.service';
import type { YearReportResponse } from '@/types/reports/year-report.types';

export function useYearReport(
  companyId: number,
  year: string,
): {
  data: YearReportResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
} {
  return useApiData<YearReportResponse>(
    () =>
      ReportsService.getYearReport(companyId, {
        date: year,
      }),
    {
      enabled: Number.isFinite(companyId) && companyId > 0 && Boolean(year),
      dependencies: [companyId, year],
    },
  );
}
