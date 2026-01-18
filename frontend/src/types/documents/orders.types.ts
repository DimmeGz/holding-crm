export type GetOrdersDto = {
  id: number;
  orderNumber: string;
  documentSum: number;
  sellerId: number;
  buyerId: number;
  recipientId: number;
  currencyId: number;
  contract: {
    createdById: number;
    name: string;
  };
  orderProductIds: number[];
  expectedDate?: Date;
  confirmExpectedDate?: Date;
  status: boolean;
};

export type GetOrderDto = {
  order: Order;
  invoices: {
    createdById: number;
    id: number;
    status: boolean;
    invoiceNumber: string;
    invoiceLines: {
      id: string;
      qty: number;
      price: number;
      packageId: number;
      cost: number;
      productId: number;
      batchId: number;
      countryOfOriginId: number;
      orderId: number;
      palletsQty: number;
      grossWeight: number;
    }[];
    shipments: [
      {
        createdById: number;
        id: number;
        status: boolean;
        receives: {
          createdById: number;
          id: number;
          status: boolean;
        }[];
      },
    ];
    payments: {
      createdById: number;
      id: number;
      status: boolean;
    }[];
  }[];
  orderConfirmations: {
    createdById: number;
    id: number;
    confirmationNumber: string;
  }[];
};

export type Order = {
  id: number;
  status: boolean;
  orderNumber: string;
  sellerId: number;
  sellerWarehouseId: number;
  buyerId: number;
  buyerWarehouseId: number;
  recipientId?: number;
  recipientWarehouseId?: number;
  createdAt: Date;
  expectedDate: Date;
  vat: number;
  currencyId: number;
  paymentDelay: number;
  incoterms: string;
  contract: {
    id: number;
    name: string;
  };
  confirmation?: Confirmation;
  orderLines: OrderLine[];
};

export type OrderLine = {
  qty: number;
  price: number;
  batchRename?: string;
  productManId: number;
  productBuyId: number;
  packageId: number;
};

type Confirmation = {
  confirmationNumber: string;
  createdAt: Date;
  buyerWarehouseId: number;
  recipientId?: number;
  recipientWarehouseId?: number;
  paymentDelay: number;
  incoterms: string;
  expectedDate: Date;
  orderLines: OrderLine[];
};
