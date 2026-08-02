import { contractsApi } from '@/api/documents/contracts.api';
import type {
  Contract,
  CreateContractPayload,
  GetContractDto,
  GetContractsDto,
  UpdateContractPayload,
} from '@/types/documents/contracts.types';

export class ContractsService {
  static async getList(): Promise<GetContractsDto[]> {
    return contractsApi.getList();
  }

  static async getById(contractId: number): Promise<GetContractDto> {
    return contractsApi.getById(contractId);
  }

  static async create(payload: CreateContractPayload): Promise<Contract> {
    return contractsApi.create(payload);
  }

  static async update(
    contractId: number,
    payload: UpdateContractPayload,
  ): Promise<Contract> {
    return contractsApi.update(contractId, payload);
  }

  static async remove(contractId: number): Promise<Contract> {
    return contractsApi.remove(contractId);
  }

  static async changeStatus(contractId: number): Promise<Contract> {
    return contractsApi.changeStatus(contractId);
  }
}
