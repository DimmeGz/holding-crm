import { Contract } from '../../entities';

export class GetContractsResponseDTO {
  actualContracts: Contract[];
  archivedContracts: Contract[];
}
