import { Injectable } from '@nestjs/common';
import { CompaniesService } from 'src/companies';
import { GoodsService } from 'src/goods';
import { LibsService } from 'src/libs';
import { WarehouseService } from 'src/warehouse';

@Injectable()
export class StoreDataService {
  constructor(
    private readonly companiesService: CompaniesService,
    private readonly goodsService: GoodsService,
    private readonly libsService: LibsService,
    private readonly warehouseService: WarehouseService,
  ) {}

  async getAllStoreData() {
    const allStoreData = {
      companies: {} as Record<number, string>,
      companyTypes: {} as Record<number, string>,
      warehouses: {},
      currencies: {},
      products: {} as Record<number, string>,
      productCountries: {} as Record<number, number | null>,
      packages: {},
      services: {},
      countries: {},
      incoterms: {},
      technicalProcesses: {} as Record<number, string>,
      batches: {} as Record<number, { name: string; productId: number }>,
    };

    const rawCompanies = await this.companiesService.getStoreData();
    const rawWarehouses = await this.warehouseService.getStoreData();
    const rawCurrencies = await this.libsService.getCurrenciesStoreData();
    const rawProducts = await this.goodsService.getProductsStoreData();
    const rawPackages = await this.goodsService.getPackagesStoreData();
    const rawServices = await this.goodsService.getServicesStoreData();
    const rawCountries = await this.libsService.getCountriesOfOriginStoreData();
    const rawIncoterms = await this.libsService.getIncotermsStoreData();
    const rawTechnicalProcesses =
      await this.libsService.getTechnicalProcessesStoreData();
    const rawBatches = await this.goodsService.getBatchesStoreData();

    rawCompanies.forEach((company) => {
      allStoreData.companies[company.id] = company.name;
      allStoreData.companyTypes[company.id] = company.companyType;
    });
    rawWarehouses.forEach(
      (warehouse) => (allStoreData.warehouses[warehouse.id] = warehouse.name),
    );
    rawCurrencies.forEach(
      (currency) => (allStoreData.currencies[currency.id] = currency.name),
    );
    rawProducts.forEach((product) => {
      allStoreData.products[product.id] = product.name;
      allStoreData.productCountries[product.id] =
        product.countryOfOriginId ?? null;
    });
    rawPackages.forEach((pack) => (allStoreData.packages[pack.id] = pack.name));
    rawServices.forEach(
      (service) => (allStoreData.services[service.id] = service.name),
    );
    rawCountries.forEach(
      (country) => (allStoreData.countries[country.id] = country.name),
    );
    rawIncoterms.forEach(
      (incoterm) => (allStoreData.incoterms[incoterm.id] = incoterm.name),
    );
    rawTechnicalProcesses.forEach(
      (process) =>
        (allStoreData.technicalProcesses[process.id] = process.name),
    );
    rawBatches.forEach(
      (batch) =>
        (allStoreData.batches[batch.id] = {
          name: batch.name,
          productId: batch.productId,
        }),
    );

    return allStoreData;
  }
}
