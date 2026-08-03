import { useApiData } from '@/hooks/useApiData';
import { CompaniesService } from '@/services/companies/companies.service';
import type { CompanyListItem } from '@/types/companies/companies.types';

export function useCompanies(): {
  data: CompanyListItem[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
} {
  return useApiData<CompanyListItem[]>(() => CompaniesService.getList(), {
    initialData: [],
  });
}
