export class GetTechnicalProcessesDataDTO {
  invoiceLines: ({ productId: number } & Record<string, any>)[];
  invoiceServiceLines: ({ serviceId: number } & Record<string, any>)[];
  [key: string]: any;
}
