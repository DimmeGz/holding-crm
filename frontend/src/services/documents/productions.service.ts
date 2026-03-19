import { productionsApi } from '@/api/documents/productions.api';
import type {
  GetProductionsDto,
  Production,
} from '@/types/documents/productions.types';

export class ProductionsService {
  static async getList(): Promise<GetProductionsDto[]> {
    const productions: GetProductionsDto[] =
      await productionsApi.getList();

    return productions;
  }

  static async getById(productionId: number): Promise<Production> {
    const production: Production = await productionsApi.getById(productionId);

    return production;
  }
}
