import type {
  ProductLineFormValue,
  ServiceLineFormValue,
} from '@/types/documents/contracts.types';
import type { OrderProductLineFormValue } from '@/types/documents/orders.types';

export const EMPTY_PRODUCT_LINE: ProductLineFormValue = {
  productId: null,
  packageId: null,
  qty: 1,
  shipQty: 1,
  price: 0,
};

export const EMPTY_ORDER_PRODUCT_LINE: OrderProductLineFormValue = {
  productManId: null,
  productBuyId: null,
  packageId: null,
  batchRename: '',
  qty: 1,
  price: 0,
};

export const EMPTY_SERVICE_LINE: ServiceLineFormValue = {
  serviceId: null,
  qty: 1,
  price: 0,
};
