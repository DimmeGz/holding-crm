import { commissionInvoicesApi } from '@/api/documents/commission-invoices.api';
import type {
  GetCommissionInvoiceDto,
  GetCommissionInvoicesDto,
} from '@/types/documents/commission-invoices.types';

export class CommissionInvoicesService {
  static async getList(): Promise<GetCommissionInvoicesDto[]> {
    const invoices: GetCommissionInvoicesDto[] =
      await commissionInvoicesApi.getList();

    return invoices;
  }

  static async getById(
    commissionInvoiceId: number,
  ): Promise<GetCommissionInvoiceDto> {
    const commissionInvoice: GetCommissionInvoiceDto =
      await commissionInvoicesApi.getById(commissionInvoiceId);

    return commissionInvoice;
  }
}
