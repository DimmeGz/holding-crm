import type { OrderProductLineFormValue } from '@/types/documents/orders.types';

export type OrderConfirmationFormValues = {
  confirmationNumber: string;
  buyerWarehouseId: string | null;
  recipientId: string | null;
  recipientWarehouseId: string | null;
  expectedDate: Date | null;
  paymentDelay: number;
  incotermsId: string | null;
  transportPlace: string;
  comment: string;
  orderLines: OrderProductLineFormValue[];
};

export type CreateOrderConfirmationLinePayload = {
  productManId: number;
  productBuyId: number;
  packageId: number;
  qty: number;
  price: number;
};

export type UpdateOrderConfirmationLinePayload =
  CreateOrderConfirmationLinePayload & {
    id?: number;
  };

export type CreateOrderConfirmationPayload = {
  orderId: number;
  sellerId: number;
  buyerId: number;
  currencyId: number;
  sellerWarehouseId: number;
  buyerWarehouseId: number;
  recipientId?: number;
  recipientWarehouseId?: number;
  paymentDelay?: number;
  confirmationNumber: string;
  expectedDate: Date;
  incotermsId: number;
  transportPlace: string;
  comment?: string;
  orderLines: CreateOrderConfirmationLinePayload[];
};

export type UpdateOrderConfirmationPayload = {
  buyerWarehouseId: number;
  recipientId?: number | null;
  recipientWarehouseId?: number | null;
  paymentDelay?: number;
  confirmationNumber: string;
  expectedDate: Date;
  incotermsId: number;
  transportPlace: string;
  comment?: string;
  orderLines: UpdateOrderConfirmationLinePayload[];
};

export type OrderConfirmation = {
  id: number;
  orderId: number;
  confirmationNumber: string;
  sellerId: number;
  buyerId: number;
  currencyId: number;
  sellerWarehouseId: number;
  buyerWarehouseId: number;
  recipientId?: number;
  recipientWarehouseId?: number;
  paymentDelay: number;
  expectedDate: Date;
  incotermsId: number;
  transportPlace: string;
  comment?: string;
  orderLines: UpdateOrderConfirmationLinePayload[];
};
