import { ContractsService } from './contracts.service';
import { Contract } from './entities';
import { CreateContractDTO, UpdateContractDTO } from './dto';
import { GetContractsQueryDTO } from './dto/query-dto';
import { GetContractResponseDTO } from './dto/response-dto';
export declare class ContractsController {
    private readonly contractsService;
    constructor(contractsService: ContractsService);
    getContracts(query?: GetContractsQueryDTO): Promise<import("./dto/response-dto").GetContractsResponseDTO>;
    getContractById(contractId: number): Promise<GetContractResponseDTO>;
    createContract(createContractDTO: CreateContractDTO): Promise<Contract>;
    updateContract(contractId: number, updateContractDTO: UpdateContractDTO): Promise<Contract>;
    removeContract(contractId: number): Promise<Contract>;
    changeContractStatus(contractId: number): Promise<Contract>;
}
