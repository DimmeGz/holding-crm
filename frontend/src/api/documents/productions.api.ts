import type { AxiosResponse } from 'axios';
import axios from 'axios';
import { http } from '@/api/http';
import { UrlConstants } from '@/constants/url-constants';
import type {
  GetProductionsDto,
  Production,
} from '@/types/documents/productions.types';

export const productionsApi: {
  getList(): Promise<GetProductionsDto[]>;
  getById(productionId: number): Promise<Production>;
} = {
  async getList(): Promise<GetProductionsDto[]> {
    try {
      const response: AxiosResponse<GetProductionsDto[]> = await http.get<
        GetProductionsDto[]
      >(UrlConstants.PRODUCTION_URL);

      return response.data;
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        throw new Error(e.message);
      }

      throw new Error('An unexpected error occurred');
    }
  },

  async getById(productionId: number): Promise<Production> {
    try {
      const response: AxiosResponse<Production> = await http.get<Production>(
        `${UrlConstants.PRODUCTION_URL}/${productionId}`,
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
