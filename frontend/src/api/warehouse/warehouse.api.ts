import { apiClient } from '@/api/api-client';
import { UrlConstants } from '@/constants/url-constants';
import type {
  GetBatchReportDto,
  GetProductReportDto,
  GetWarehouseAccountingDto,
  WarehouseListQuery,
} from '@/types/warehouse/warehouse.types';

function buildWarehouseQuery(query?: WarehouseListQuery): string {
  if (!query) {
    return '';
  }

  const params = new URLSearchParams();
  if (query.company) {
    params.set('company', String(query.company));
  }
  if (query.warehouse) {
    params.set('warehouse', String(query.warehouse));
  }
  if (query.process) {
    params.set('process', String(query.process));
  }

  const search = params.toString();
  return search ? `?${search}` : '';
}

export const warehouseApi = {
  getList(query?: WarehouseListQuery): Promise<GetWarehouseAccountingDto[]> {
    return apiClient.get<GetWarehouseAccountingDto[]>(
      `${UrlConstants.WAREHOUSE_URL}${buildWarehouseQuery(query)}`,
    );
  },

  getProductReport(productId: number): Promise<GetProductReportDto> {
    return apiClient.get<GetProductReportDto>(
      `${UrlConstants.GOODS_PRODUCT_URL}/${productId}`,
    );
  },

  getBatchReport(batchId: number): Promise<GetBatchReportDto> {
    return apiClient.get<GetBatchReportDto>(
      `${UrlConstants.GOODS_BATCH_URL}/${batchId}`,
    );
  },
};
