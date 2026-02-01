import { invoicesApi } from '@/api/documents/invoices.api';
import type { GetInvoicesDto } from '@/types/documents/invoices.types';

export class InvoicesService {
  static async getList(): Promise<GetInvoicesDto[]> {
    const invoices: GetInvoicesDto[] = await invoicesApi.getList();

    return invoices;
  }

  //   static async getById(invoiceId: number): Promise<unknown> {
  //     const contract: unknown = await contractsApi.getById(invoiceId);

  //     return contract;
  //   }
}
