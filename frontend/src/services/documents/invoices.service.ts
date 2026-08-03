import { invoicesApi } from '@/api/documents/invoices.api';
import type { DatedDocumentsListQuery } from '@/helpers/documents-query.helpers';
import type {
  CreateInvoiceByContractPayload,
  CreateInvoicePayload,
  GetInvoiceDto,
  GetInvoicesDto,
  Invoice,
  ShipReceiveResult,
  UpdateInvoicePayload,
} from '@/types/documents/invoices.types';

export class InvoicesService {
  static async getList(
    query?: DatedDocumentsListQuery,
  ): Promise<GetInvoicesDto[]> {
    return invoicesApi.getList(query);
  }

  static async getById(invoiceId: number): Promise<GetInvoiceDto> {
    return invoicesApi.getById(invoiceId);
  }

  static async create(payload: CreateInvoicePayload): Promise<Invoice> {
    return invoicesApi.create(payload);
  }

  static async createByContract(
    payload: CreateInvoiceByContractPayload,
  ): Promise<Invoice> {
    return invoicesApi.createByContract(payload);
  }

  static async update(
    invoiceId: number,
    payload: UpdateInvoicePayload,
  ): Promise<Invoice> {
    return invoicesApi.update(invoiceId, payload);
  }

  static async remove(invoiceId: number): Promise<Invoice> {
    return invoicesApi.remove(invoiceId);
  }

  static async changeStatus(invoiceId: number): Promise<Invoice> {
    return invoicesApi.changeStatus(invoiceId);
  }

  static async shipReceive(invoiceId: number): Promise<ShipReceiveResult> {
    return invoicesApi.shipReceive(invoiceId);
  }
}
