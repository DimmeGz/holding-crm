import { libsDataApi } from '@/api/stores/libs-data';
import type { LibsData } from '@/types/common.types';

export class LibsDataService {
  static async getLibsData(): Promise<LibsData> {
    const libsData: LibsData = await libsDataApi.getLibsData();

    return libsData;
  }
}
