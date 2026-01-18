import { create, type StoreApi, type UseBoundStore } from 'zustand';
import { LibsDataService } from '@/services/libs-data.service';
import type { LibsData, LibsStore } from '@/types/common.types';

export const useLibsStore: UseBoundStore<StoreApi<LibsStore>> =
  create<LibsStore>((set, get) => ({
    companies: {},
    warehouses: {},
    currencies: {},
    isLoaded: false,

    loadAll: async (): Promise<void> => {
      try {
        const data: LibsData = await LibsDataService.getLibsData();

        set({
          companies: data.companies,
          warehouses: data.warehouses,
          currencies: data.currencies,
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

    getCurrency: (id: number): string => {
      return get().currencies[id] || `Unknown currency (ID: ${id})`;
    },
  }));
