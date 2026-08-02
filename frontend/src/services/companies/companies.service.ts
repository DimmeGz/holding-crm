import { companiesApi } from '@/api/companies/companies.api';
import type { CompanyDefaultWarehouse } from '@/types/documents/orders.types';

export class CompaniesService {
  static async getById(companyId: number): Promise<CompanyDefaultWarehouse> {
    return companiesApi.getById(companyId);
  }
}
