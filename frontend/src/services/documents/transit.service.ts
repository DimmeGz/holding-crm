import { transitApi } from '@/api/documents/transit.api';
import type { GetTransitLineDto } from '@/types/documents/transit.types';

export class TransitService {
  static async getList(): Promise<GetTransitLineDto[]> {
    return transitApi.getList();
  }
}
