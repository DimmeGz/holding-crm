import { useApiData } from '@/hooks/useApiData';
import { ContractsService } from '@/services/documents/contracts.service';
import type { GetContractsDto } from '@/types/documents/contracts.types';

export function useContracts(): {
  data: GetContractsDto[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
} {
  return useApiData<GetContractsDto[]>(() => ContractsService.getList(), {
    initialData: [],
  });
}

export function useContract(contractId: number): {
  data: any | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
} {
  return useApiData<any>(() => ContractsService.getById(contractId), {
    dependencies: [contractId],
  });
}
