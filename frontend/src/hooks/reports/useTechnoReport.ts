import { useApiData } from '@/hooks/useApiData';
import { ReportsService } from '@/services/reports/reports.service';
import type { TechnoReportResponse } from '@/types/reports/techno-report.types';

export function useTechnoReport(
  startDate: string,
  endDate: string,
  process: number | null,
): {
  data: TechnoReportResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
} {
  return useApiData<TechnoReportResponse>(
    () =>
      ReportsService.getTechnoReport({
        startDate,
        endDate,
        process: process as number,
      }),
    {
      enabled:
        Boolean(startDate) &&
        Boolean(endDate) &&
        process !== null &&
        Number.isFinite(process),
      dependencies: [startDate, endDate, process],
    },
  );
}
