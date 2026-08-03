import { create, type StoreApi, type UseBoundStore } from 'zustand';
import { LibsDataService } from '@/services/libs-data.service';
import type { LibsData, LibsStore } from '@/types/common.types';

export const useLibsStore: UseBoundStore<StoreApi<LibsStore>> =
  create<LibsStore>((set, get) => ({
    companies: {},
    companyTypes: {},
    warehouses: {},
    currencies: {},
    products: {},
    packages: {},
    services: {},
    countries: {},
    incoterms: {},
    technicalProcesses: {},
    batches: {},
    isLoaded: false,

    loadAll: async (): Promise<void> => {
      try {
        const data: LibsData = await LibsDataService.getLibsData();

        set({
          ...data,
          companyTypes: data.companyTypes ?? {},
          technicalProcesses: data.technicalProcesses ?? {},
          batches: data.batches ?? {},
          isLoaded: true,
        });
      } catch (error) {
        console.error('Failed to load references:', error);
      }
    },

    getCompanyName: (id: number): string => {
      return get().companies[id] || `Unknown company (ID: ${id})`;
    },

    getWarehouseName: (id: number): string => {
      return get().warehouses[id] || `Unknown warehouse (ID: ${id})`;
    },

    getCurrencyName: (id: number): string => {
      return get().currencies[id] || `Unknown currency (ID: ${id})`;
    },

    getProductName: (id: number): string => {
      return get().products[id] || `Unknown product (ID: ${id})`;
    },

    getPackageName: (id: number): string => {
      return get().packages[id] || `Unknown package (ID: ${id})`;
    },

    getServiceName: (id: number): string => {
      return get().services[id] || `Unknown service (ID: ${id})`;
    },

    getCountryName: (id: number): string => {
      return get().countries[id] || `Unknown country (ID: ${id})`;
    },

    getIncotermsName: (id: number): string => {
      return get().incoterms[id] || `Unknown incoterms (ID: ${id})`;
    },

    getBatchName: (id: number): string => {
      return get().batches[id]?.name || `Unknown batch (ID: ${id})`;
    },
  }));
