import { invoicesApi } from '@/api/documents/invoices.api';
import type {
  GetInvoiceDto,
  GetInvoicesDto,
} from '@/types/documents/invoices.types';

export class InvoicesService {
  static async getList(): Promise<GetInvoicesDto[]> {
    const invoices: GetInvoicesDto[] = await invoicesApi.getList();

    return invoices;
  }

  static async getById(invoiceId: number): Promise<GetInvoiceDto> {
    const contract: GetInvoiceDto = await invoicesApi.getById(invoiceId);

    return contract;
  }
}
