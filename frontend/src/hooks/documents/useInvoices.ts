import { useApiData } from '@/hooks/useApiData';
import { InvoicesService } from '@/services/documents/invoices.service';
import type {
  GetInvoiceDto,
  GetInvoicesDto,
} from '@/types/documents/invoices.types';

export function useInvoices(): {
  data: GetInvoicesDto[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
} {
  return useApiData<GetInvoicesDto[]>(() => InvoicesService.getList(), {
    initialData: [],
  });
}

export function useInvoice(
  invoiceId: number,
  enabled = true,
): {
  data: GetInvoiceDto | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
} {
  return useApiData<GetInvoiceDto>(() => InvoicesService.getById(invoiceId), {
    dependencies: [invoiceId, enabled],
    enabled: enabled && invoiceId > 0,
  });
}
