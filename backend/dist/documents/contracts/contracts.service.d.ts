import { DataSource, Repository } from 'typeorm';
import { GoodsService } from '../../goods';
import { OrdersService } from '../orders';
import { ShipmentService } from '../shipment';
import { Contract } from './entities';
import { CreateContractDTO, UpdateContractDTO } from './dto';
import { GetContractResponseDTO, GetContractsResponseDTO } from './dto/response-dto';
import { GetContractsQueryDTO } from './dto/query-dto';
export declare class ContractsService {
    private readonly contractsRepository;
    private readonly ordersService;
    private readonly shipmentsService;
    private readonly goodsService;
    private dataSource;
    constructor(contractsRepository: Repository<Contract>, ordersService: OrdersService, shipmentsService: ShipmentService, goodsService: GoodsService, dataSource: DataSource);
    private createBaseQueryBuilder;
    private applyContractListSelect;
    private applyContractDetailSelect;
    private ApplyQueryFilter;
    getContracts(query: GetContractsQueryDTO): Promise<GetContractsResponseDTO>;
    getContractById(contractId: number): Promise<GetContractResponseDTO>;
    createContract(createContractDTO: CreateContractDTO): Promise<Contract>;
    private getTechnicalProcesses;
    updateContract(contractId: number, updateContractDTO: UpdateContractDTO): Promise<Contract>;
    removeContract(contractId: number): Promise<Contract>;
    changeContractStatus(contractId: number): Promise<Contract>;
    getOrderPrefix(contractId: number): Promise<string>;
}
