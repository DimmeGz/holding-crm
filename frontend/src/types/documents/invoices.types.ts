export type GetInvoicesDto = {
  id: number;
  invoiceNumber: string;
  sellerId: number;
  buyerId: number;
  recipientId: number;
  documentSum: number;
  currencyId: number;
  status: boolean;
  expectedDate: Date;
  parent?: {
    id: number;
    invoiceNumber: string;
  };
};
