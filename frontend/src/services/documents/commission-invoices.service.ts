import { commissionInvoicesApi } from '@/api/documents/commission-invoices.api';
import type {
  CreateCommissionInvoicePayload,
  GetCommissionInvoiceDto,
  GetCommissionInvoicesDto,
  UpdateCommissionInvoicePayload,
} from '@/types/documents/commission-invoices.types';

export class CommissionInvoicesService {
  static async getList(): Promise<GetCommissionInvoicesDto[]> {
    return commissionInvoicesApi.getList();
  }

  static async getById(
    commissionInvoiceId: number,
  ): Promise<GetCommissionInvoiceDto> {
    return commissionInvoicesApi.getById(commissionInvoiceId);
  }

  static async create(
    payload: CreateCommissionInvoicePayload,
  ): Promise<GetCommissionInvoiceDto> {
    return commissionInvoicesApi.create(payload);
  }

  static async update(
    commissionInvoiceId: number,
    payload: UpdateCommissionInvoicePayload,
  ): Promise<GetCommissionInvoiceDto> {
    return commissionInvoicesApi.update(commissionInvoiceId, payload);
  }

  static async remove(
    commissionInvoiceId: number,
  ): Promise<GetCommissionInvoiceDto> {
    return commissionInvoicesApi.remove(commissionInvoiceId);
  }

  static async changeStatus(
    commissionInvoiceId: number,
  ): Promise<GetCommissionInvoiceDto> {
    return commissionInvoicesApi.changeStatus(commissionInvoiceId);
  }
}
