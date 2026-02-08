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

  static async getById(contractId: number): Promise<GetContractDto> {
    const contract: GetContractDto = await contractsApi.getById(contractId);

    return contract;
  }
}
