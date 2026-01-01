import { BaseContractDTO } from './base-contract-dto';
import { UpdateContractLineDTO } from './update-contract-line.dto';
import { CreateContractLineDTO } from './create-contract-line.dto';
import { CreateServiceLineDTO, UpdateServiceLineDTO } from '../../common/dto';
export declare class UpdateContractDTO extends BaseContractDTO {
    contractLines: (CreateContractLineDTO | UpdateContractLineDTO)[];
    contractServiceLines: (CreateServiceLineDTO | UpdateServiceLineDTO)[];
}
