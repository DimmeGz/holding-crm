import { apiClient } from '@/api/api-client';
import type {
  CompanyDetail,
  CompanyListItem,
} from '@/types/companies/companies.types';
import type { CompanyDefaultWarehouse } from '@/types/documents/orders.types';

export const companiesApi = {
  getList(): Promise<CompanyListItem[]> {
    return apiClient.get<CompanyListItem[]>('/companies');
  },

  getById(companyId: number): Promise<CompanyDefaultWarehouse> {
    return apiClient.get<CompanyDefaultWarehouse>(`/companies/${companyId}`);
  },

  getDetailById(companyId: number): Promise<CompanyDetail> {
    return apiClient.get<CompanyDetail>(`/companies/${companyId}`);
  },
};
