import type { AxiosResponse } from 'axios';
import axios from 'axios';
import { http } from '@/api/http';
import { UrlConstants } from '@/constants/url-constants';
import type { LibsData } from '@/types/common.types';

export const libsDataApi: {
  getLibsData(): Promise<LibsData>;
} = {
  async getLibsData(): Promise<LibsData> {
    try {
      const response: AxiosResponse<LibsData> = await http.get<LibsData>(
        UrlConstants.LIBS_DATA_URL,
      );

      return response.data;
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        throw new Error(e.message);
      }

      throw new Error('An unexpected error occurred');
    }
  },
};
