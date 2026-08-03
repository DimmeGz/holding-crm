import { warehouseApi } from '@/api/warehouse/warehouse.api';
import type {
  GetBatchReportDto,
  GetProductReportDto,
  GetWarehouseAccountingDto,
  WarehouseListQuery,
} from '@/types/warehouse/warehouse.types';

export class WarehouseService {
  static async getList(
    query?: WarehouseListQuery,
  ): Promise<GetWarehouseAccountingDto[]> {
    return warehouseApi.getList(query);
  }

  static async getProductReport(
    productId: number,
  ): Promise<GetProductReportDto> {
    return warehouseApi.getProductReport(productId);
  }

  static async getBatchReport(batchId: number): Promise<GetBatchReportDto> {
    return warehouseApi.getBatchReport(batchId);
  }
}
