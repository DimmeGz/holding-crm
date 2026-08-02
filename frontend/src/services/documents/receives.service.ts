import { receivesApi } from '@/api/documents/receives.api';
import type {
  CreateReceivePayload,
  GetReceivesDto,
  Receive,
  UpdateReceivePayload,
} from '@/types/documents/receives.types';

export class ReceivesService {
  static async getList(): Promise<GetReceivesDto[]> {
    return receivesApi.getList();
  }

  static async getById(receiveId: number): Promise<Receive> {
    return receivesApi.getById(receiveId);
  }

  static async create(payload: CreateReceivePayload): Promise<Receive> {
    return receivesApi.create(payload);
  }

  static async update(
    receiveId: number,
    payload: UpdateReceivePayload,
  ): Promise<Receive> {
    return receivesApi.update(receiveId, payload);
  }

  static async remove(receiveId: number): Promise<Receive> {
    return receivesApi.remove(receiveId);
  }

  static async changeStatus(receiveId: number): Promise<Receive> {
    return receivesApi.changeStatus(receiveId);
  }
}
