import { useApiData } from '@/hooks/useApiData';
import { ContractsService } from '@/services/documents/contracts.service';
import type {
  GetContractDto,
  GetContractsDto,
} from '@/types/documents/contracts.types';

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

export function useContract(
  contractId: number,
  enabled = true,
): {
  data: GetContractDto | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
} {
  return useApiData<GetContractDto>(
    () => ContractsService.getById(contractId),
    {
      dependencies: [contractId, enabled],
      enabled: enabled && contractId > 0,
    },
  );
}
