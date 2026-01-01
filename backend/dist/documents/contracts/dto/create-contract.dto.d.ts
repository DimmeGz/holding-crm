import { CreateContractLineDTO } from './create-contract-line.dto';
import { BaseContractDTO } from './base-contract-dto';
import { CreateServiceLineDTO } from '../../common/dto';
export declare class CreateContractDTO extends BaseContractDTO {
    contractLines: CreateContractLineDTO[];
    contractServiceLines: CreateServiceLineDTO[];
}
