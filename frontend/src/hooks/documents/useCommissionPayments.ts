import { useApiData } from '@/hooks/useApiData';
import { CommissionPaymentsService } from '@/services/documents/commission-payments.service';
import type {
  GetCommissionPaymentDto,
  GetCommissionPaymentsDto,
} from '@/types/documents/commission-payments.types';

export function useCommissionPayments(): {
  data: GetCommissionPaymentsDto[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
} {
  return useApiData<GetCommissionPaymentsDto[]>(
    () => CommissionPaymentsService.getList(),
    {
      initialData: [],
    },
  );
}

export function useCommissionPayment(
  commissionPaymentId: number,
  enabled = true,
): {
  data: GetCommissionPaymentDto | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
} {
  return useApiData<GetCommissionPaymentDto>(
    () => CommissionPaymentsService.getById(commissionPaymentId),
    {
      dependencies: [commissionPaymentId, enabled],
      enabled: enabled && commissionPaymentId > 0,
    },
  );
}
