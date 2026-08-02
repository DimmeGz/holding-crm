import { apiClient } from '@/api/api-client';
import type { CompanyDefaultWarehouse } from '@/types/documents/orders.types';

export const companiesApi = {
  getById(companyId: number): Promise<CompanyDefaultWarehouse> {
    return apiClient.get<CompanyDefaultWarehouse>(`/companies/${companyId}`);
  },
};
