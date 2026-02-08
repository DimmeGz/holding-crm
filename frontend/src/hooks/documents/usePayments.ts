import { useApiData } from '@/hooks/useApiData';
import { PaymentsService } from '@/services/documents/payments.service';
import type {
  GetPaymentDto,
  GetPaymentsDto,
} from '@/types/documents/payments.types';

export function usePayments(): {
  data: GetPaymentsDto[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
} {
  return useApiData<GetPaymentsDto[]>(() => PaymentsService.getList(), {
    initialData: [],
  });
}

export function usePayment(paymentId: number): {
  data: GetPaymentDto | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
} {
  return useApiData<GetPaymentDto>(() => PaymentsService.getById(paymentId), {
    dependencies: [paymentId],
  });
}
