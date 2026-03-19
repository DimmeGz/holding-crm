import type { AxiosResponse } from 'axios';
import axios from 'axios';
import { http } from '@/api/http';
import { UrlConstants } from '@/constants/url-constants';
import type {
  GetTransportsDto,
  GetTransportDto,
} from '@/types/documents/transports.types';

export const transportsApi: {
  getList(): Promise<GetTransportsDto[]>;
  getById(transportId: number): Promise<GetTransportDto>;
} = {
  async getList(): Promise<GetTransportsDto[]> {
    try {
      const response: AxiosResponse<GetTransportsDto[]> = await http.get<
        GetTransportsDto[]
      >(UrlConstants.TRANSPORT_URL);

      return response.data;
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        throw new Error(e.message);
      }

      throw new Error('An unexpected error occurred');
    }
  },

  async getById(transportId: number): Promise<GetTransportDto> {
    try {
      const response: AxiosResponse<GetTransportDto> = await http.get<
        GetTransportDto
      >(`${UrlConstants.TRANSPORT_URL}/${transportId}`);

      console.log('response', `${UrlConstants.TRANSPORT_URL}/${transportId}`, response)

      return response.data;
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        throw new Error(e.message);
      }

      throw new Error('An unexpected error occurred');
    }
  },
};

