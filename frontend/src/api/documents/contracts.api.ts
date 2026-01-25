import type { AxiosResponse } from 'axios';
import axios from 'axios';
import { http } from '@/api/http';
import { UrlConstants } from '@/constants/url-constants';
import type { GetContractsDto } from '@/types/documents/contracts.types';

export const contractsApi: {
  getList(): Promise<GetContractsDto[]>;
  getById(contractId: number): Promise<any>;
} = {
  async getList(): Promise<GetContractsDto[]> {
    try {
      const response: AxiosResponse<GetContractsDto[]> = await http.get<
        GetContractsDto[]
      >(UrlConstants.CONTRACTS_URL);

      return response.data;
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        throw new Error(e.message);
      }

      throw new Error('An unexpected error occurred');
    }
  },

  async getById(contractId: number): Promise<any> {
    try {
      const response: AxiosResponse<any> = await http.get<any>(
        `${UrlConstants.CONTRACTS_URL}/${contractId}`,
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
