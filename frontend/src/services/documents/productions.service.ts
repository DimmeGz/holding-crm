import { productionsApi } from '@/api/documents/productions.api';
import type {
  CreateProductionPayload,
  GetProductionsDto,
  Production,
  UpdateProductionPayload,
} from '@/types/documents/productions.types';

export class ProductionsService {
  static async getList(): Promise<GetProductionsDto[]> {
    return productionsApi.getList();
  }

  static async getById(productionId: number): Promise<Production> {
    return productionsApi.getById(productionId);
  }

  static async create(payload: CreateProductionPayload): Promise<Production> {
    return productionsApi.create(payload);
  }

  static async update(
    productionId: number,
    payload: UpdateProductionPayload,
  ): Promise<Production> {
    return productionsApi.update(productionId, payload);
  }

  static async remove(productionId: number): Promise<Production> {
    return productionsApi.remove(productionId);
  }

  static async changeStatus(productionId: number): Promise<Production> {
    return productionsApi.changeStatus(productionId);
  }
}
