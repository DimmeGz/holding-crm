import { useApiData } from '@/hooks/useApiData';
import { ReportsService } from '@/services/reports/reports.service';
import type { ProductionReportResponse } from '@/types/reports/production-report.types';

export function useProductionReport(
  companyId: number,
  date: string,
  process: number | null,
): {
  data: ProductionReportResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
} {
  return useApiData<ProductionReportResponse>(
    () =>
      ReportsService.getProductionReport(companyId, {
        date,
        ...(process ? { process } : {}),
      }),
    {
      enabled: Number.isFinite(companyId) && companyId > 0 && Boolean(date),
      dependencies: [companyId, date, process],
    },
  );
}
