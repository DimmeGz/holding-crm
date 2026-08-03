import type { DatedDocumentsListQuery } from '@/helpers/documents-query.helpers';
import { useApiData } from '@/hooks/useApiData';
import { InvoicesService } from '@/services/documents/invoices.service';
import type {
  GetInvoiceDto,
  GetInvoicesDto,
} from '@/types/documents/invoices.types';

export function useInvoices(query?: DatedDocumentsListQuery): {
  data: GetInvoicesDto[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
} {
  const queryKey = JSON.stringify(query ?? {});

  return useApiData<GetInvoicesDto[]>(() => InvoicesService.getList(query), {
    initialData: [],
    dependencies: [queryKey],
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
