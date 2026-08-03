import type { PaymentsListQuery } from '@/helpers/documents-query.helpers';
import { useApiData } from '@/hooks/useApiData';
import { PaymentsService } from '@/services/documents/payments.service';
import type {
  GetPaymentDto,
  GetPaymentsDto,
} from '@/types/documents/payments.types';

export function usePayments(query?: PaymentsListQuery): {
  data: GetPaymentsDto[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
} {
  const queryKey = JSON.stringify(query ?? {});

  return useApiData<GetPaymentsDto[]>(() => PaymentsService.getList(query), {
    initialData: [],
    dependencies: [queryKey],
  });
}

export function usePaymentsByCreation(): {
  data: GetPaymentsDto[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
} {
  return useApiData<GetPaymentsDto[]>(
    () => PaymentsService.getByCreationList(),
    {
      initialData: [],
    },
  );
}

export function usePayment(
  paymentId: number,
  enabled = true,
): {
  data: GetPaymentDto | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
} {
  return useApiData<GetPaymentDto>(() => PaymentsService.getById(paymentId), {
    dependencies: [paymentId, enabled],
    enabled: enabled && paymentId > 0,
  });
}
