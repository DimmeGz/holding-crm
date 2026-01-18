import { contractsApi } from '@/api/documents/contracts.api';
import type { GetContractsDto } from '@/types/documents/contracts.types';

export class ContractsService {
  static async getList(): Promise<GetContractsDto[]> {
    const orders: GetContractsDto[] = await contractsApi.getList();

    return orders;
  }

  // static async getById(orderId: number): Promise<any> {
  //   const order: any = await contractsApi.getById(orderId);

  //   return order;
  // }
}
