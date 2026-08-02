import { useApiData } from '@/hooks/useApiData';
import { CommissionInvoicesService } from '@/services/documents/commission-invoices.service';
import type {
  GetCommissionInvoiceDto,
  GetCommissionInvoicesDto,
} from '@/types/documents/commission-invoices.types';

export function useCommissionInvoices(): {
  data: GetCommissionInvoicesDto[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
} {
  return useApiData<GetCommissionInvoicesDto[]>(
    () => CommissionInvoicesService.getList(),
    {
      initialData: [],
    },
  );
}

export function useCommissionInvoice(
  commissionInvoiceId: number,
  enabled = true,
): {
  data: GetCommissionInvoiceDto | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
} {
  return useApiData<GetCommissionInvoiceDto>(
    () => CommissionInvoicesService.getById(commissionInvoiceId),
    {
      dependencies: [commissionInvoiceId, enabled],
      enabled: enabled && commissionInvoiceId > 0,
    },
  );
}
