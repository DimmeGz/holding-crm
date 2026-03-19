import { receivesApi } from '@/api/documents/receives.api';
import type {
  GetReceivesDto,
  Receive,
} from '@/types/documents/receives.types';

export class ReceivesService {
  static async getList(): Promise<GetReceivesDto[]> {
    const receives: GetReceivesDto[] = await receivesApi.getList();

    return receives;
  }

  static async getById(receiveId: number): Promise<Receive> {
    const receive: Receive = await receivesApi.getById(receiveId);

    return receive;
  }
}
