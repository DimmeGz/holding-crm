import { create, type StoreApi, type UseBoundStore } from 'zustand';
import { LibsDataService } from '@/services/libs-data.service';
import type { LibsData, LibsStore } from '@/types/common.types';

export const useLibsStore: UseBoundStore<StoreApi<LibsStore>> =
  create<LibsStore>((set, get) => ({
    companies: {},
    warehouses: {},
    currencies: {},
    products: {},
    packages: {},
    isLoaded: false,

    loadAll: async (): Promise<void> => {
      try {
        const data: LibsData = await LibsDataService.getLibsData();

        set({
          ...data,
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
  }));
