import { contractsApi } from '@/api/documents/contracts.api';
import type {
  GetContractDto,
  GetContractsDto,
} from '@/types/documents/contracts.types';

export class ContractsService {
  static async getList(): Promise<GetContractsDto[]> {
    const contracts: GetContractsDto[] = await contractsApi.getList();

    return contracts;
  }

  static async getById(orderId: number): Promise<GetContractDto> {
    const contract: GetContractDto = await contractsApi.getById(orderId);

    return contract;
  }
}
