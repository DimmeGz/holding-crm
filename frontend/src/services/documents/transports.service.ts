import { transportsApi } from '@/api/documents/transports.api';
import type {
  CreateTransportPayload,
  GetTransportDto,
  GetTransportsDto,
  UpdateTransportPayload,
} from '@/types/documents/transports.types';

export class TransportService {
  static async getList(): Promise<GetTransportsDto[]> {
    return transportsApi.getList();
  }

  static async getById(transportId: number): Promise<GetTransportDto> {
    return transportsApi.getById(transportId);
  }

  static async create(
    payload: CreateTransportPayload,
  ): Promise<GetTransportDto> {
    return transportsApi.create(payload);
  }

  static async update(
    transportId: number,
    payload: UpdateTransportPayload,
  ): Promise<GetTransportDto> {
    return transportsApi.update(transportId, payload);
  }

  static async remove(transportId: number): Promise<GetTransportDto> {
    return transportsApi.remove(transportId);
  }

  static async changeStatus(transportId: number): Promise<GetTransportDto> {
    return transportsApi.changeStatus(transportId);
  }
}
