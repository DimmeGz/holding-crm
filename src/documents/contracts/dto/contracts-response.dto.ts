import { Contract } from '../entities';

export class ContractsResponseDTO {
  actualContracts: Contract[];
  archivedContracts: Contract[];
}
