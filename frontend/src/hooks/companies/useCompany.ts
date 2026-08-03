import { useApiData } from '@/hooks/useApiData';
import { CompaniesService } from '@/services/companies/companies.service';
import type { CompanyDetail } from '@/types/companies/companies.types';

export function useCompany(companyId: number): {
  data: CompanyDetail | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
} {
  return useApiData<CompanyDetail>(
    () => CompaniesService.getDetailById(companyId),
    {
      initialData: null,
      dependencies: [companyId],
      enabled: Number.isFinite(companyId) && companyId > 0,
    },
  );
}
