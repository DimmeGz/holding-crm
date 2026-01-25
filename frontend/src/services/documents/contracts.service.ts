import { contractsApi } from '@/api/documents/contracts.api';
import type { GetContractsDto } from '@/types/documents/contracts.types';

export class ContractsService {
  static async getList(): Promise<GetContractsDto[]> {
    const contracts: GetContractsDto[] = await contractsApi.getList();

    return contracts;
  }

  static async getById(orderId: number): Promise<any> {
    const contract: any = await contractsApi.getById(orderId);

    return contract;
  }
}
