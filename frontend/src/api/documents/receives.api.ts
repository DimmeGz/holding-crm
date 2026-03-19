import type { AxiosResponse } from 'axios';
import axios from 'axios';
import { http } from '@/api/http';
import { UrlConstants } from '@/constants/url-constants';
import type {
  GetReceivesDto,
  Receive,
} from '@/types/documents/receives.types';

export const receivesApi: {
  getList(): Promise<GetReceivesDto[]>;
  getById(receiveId: number): Promise<Receive>;
} = {
  async getList(): Promise<GetReceivesDto[]> {
    try {
      const response: AxiosResponse<GetReceivesDto[]> = await http.get<
        GetReceivesDto[]
      >(UrlConstants.RECEIVES_URL);

      return response.data;
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        throw new Error(e.message);
      }

      throw new Error('An unexpected error occurred');
    }
  },

  async getById(receiveId: number): Promise<Receive> {
    try {
      const response: AxiosResponse<Receive> = await http.get<Receive>(
        `${UrlConstants.RECEIVES_URL}/${receiveId}`,
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
