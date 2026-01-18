import { Injectable } from '@nestjs/common';
import { CompaniesService } from 'src/companies';
import { LibsService } from 'src/libs';
import { WarehouseService } from 'src/warehouse';

@Injectable()
export class StoreDataService {
  constructor(
    private readonly companiesService: CompaniesService,
    private readonly warehouseService: WarehouseService,
    private readonly libsService: LibsService,
  ) {}

  async getAllStoreData() {
    const allStoreData = {
      companies: {},
      warehouses: {},
      currencies: {},
    };

    const rawCompanies = await this.companiesService.getStoreData();
    const rawWarehouses = await this.warehouseService.getStoreData();
    const rawCurrencies = await this.libsService.getCurrenciesStoreData();

    rawCompanies.forEach(
      (company) => (allStoreData.companies[company.id] = company.name),
    );
    rawWarehouses.forEach(
      (warehouse) => (allStoreData.warehouses[warehouse.id] = warehouse.name),
    );
    rawCurrencies.forEach(
      (currency) => (allStoreData.currencies[currency.id] = currency.name),
    );

    return allStoreData;
  }
}
