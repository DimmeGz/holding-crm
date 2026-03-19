import type { AxiosResponse } from 'axios';
import axios from 'axios';
import { http } from '@/api/http';
import { UrlConstants } from '@/constants/url-constants';
import type {
  GetShipmentDto,
  GetShipmentsDto,
} from '@/types/documents/shipments.types';

export const shipmentsApi: {
  getList(): Promise<GetShipmentsDto[]>;
  getById(shipmentId: number): Promise<GetShipmentDto>;
} = {
  async getList(): Promise<GetShipmentsDto[]> {
    try {
      const response: AxiosResponse<GetShipmentsDto[]> = await http.get<
        GetShipmentsDto[]
      >(UrlConstants.SHIPMENTS_URL);

      return response.data;
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        throw new Error(e.message);
      }

      throw new Error('An unexpected error occurred');
    }
  },

  async getById(shipmentId: number): Promise<GetShipmentDto> {
    try {
      const response: AxiosResponse<GetShipmentDto> =
        await http.get<GetShipmentDto>(
          `${UrlConstants.SHIPMENTS_URL}/${shipmentId}`,
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

