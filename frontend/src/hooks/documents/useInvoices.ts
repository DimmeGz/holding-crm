import { useApiData } from '@/hooks/useApiData';
import { InvoicesService } from '@/services/documents/invoices.service';
import type { GetInvoicesDto } from '@/types/documents/invoices.types';

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

// export function useContract(invoiceId: number): {
//   data: any | null;
//   loading: boolean;
//   error: string | null;
//   refetch: () => void;
// } {
//   return useApiData<any>(
//     () => ContractsService.getById(invoiceId),
//     {
//       dependencies: [invoiceId],
//     },
//   );
// }
