import { companiesApi } from '@/api/companies/companies.api';
import type {
  CompanyDetail,
  CompanyListItem,
} from '@/types/companies/companies.types';
import type { CompanyDefaultWarehouse } from '@/types/documents/orders.types';

export class CompaniesService {
  static async getList(): Promise<CompanyListItem[]> {
    return companiesApi.getList();
  }

  static async getById(companyId: number): Promise<CompanyDefaultWarehouse> {
    return companiesApi.getById(companyId);
  }

  static async getDetailById(companyId: number): Promise<CompanyDetail> {
    return companiesApi.getDetailById(companyId);
  }
}
