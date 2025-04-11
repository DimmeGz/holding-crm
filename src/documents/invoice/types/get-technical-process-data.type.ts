export type GetTechnicalProcessesData = {
  invoiceLines: ({ productId: number } & Record<string, any>)[];
  invoiceServiceLines: ({ serviceId: number } & Record<string, any>)[];
} & Record<string, any>;
