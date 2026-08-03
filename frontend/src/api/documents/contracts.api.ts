import { apiClient } from '@/api/api-client';
import { UrlConstants } from '@/constants/url-constants';
import {
  buildDocumentsQueryString,
  type ContractsListQuery,
} from '@/helpers/documents-query.helpers';
import type {
  Contract,
  CreateContractPayload,
  GetContractDto,
  GetContractsDto,
  UpdateContractPayload,
} from '@/types/documents/contracts.types';

export const contractsApi = {
  getList(query?: ContractsListQuery): Promise<GetContractsDto[]> {
    return apiClient.get<GetContractsDto[]>(
      `${UrlConstants.CONTRACTS_URL}${buildDocumentsQueryString(query)}`,
    );
  },

  getById(contractId: number): Promise<GetContractDto> {
    return apiClient.get<GetContractDto>(
      `${UrlConstants.CONTRACTS_URL}/${contractId}`,
    );
  },

  create(payload: CreateContractPayload): Promise<Contract> {
    return apiClient.post<Contract>(UrlConstants.CONTRACTS_URL, payload);
  },

  update(contractId: number, payload: UpdateContractPayload): Promise<Contract> {
    return apiClient.patch<Contract>(
      `${UrlConstants.CONTRACTS_URL}/${contractId}`,
      payload,
    );
  },

  remove(contractId: number): Promise<Contract> {
    return apiClient.del<Contract>(
      `${UrlConstants.CONTRACTS_URL}/${contractId}`,
    );
  },

  changeStatus(contractId: number): Promise<Contract> {
    return apiClient.patch<Contract>(
      `${UrlConstants.CONTRACTS_URL}/change-status/${contractId}`,
    );
  },
};
