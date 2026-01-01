import { DataSource, Repository } from 'typeorm';
import { LibsService } from '../../libs';
import { WarehouseService } from '../../warehouse';
import { Production } from './entities';
import { CreateProductionDTO, UpdateProductionDTO } from './dto';
export declare class ProductionService {
    private readonly productionsRepository;
    private dataSource;
    private readonly libsService;
    private readonly warehouseService;
    constructor(productionsRepository: Repository<Production>, dataSource: DataSource, libsService: LibsService, warehouseService: WarehouseService);
    private createBaseQueryBuilder;
    private applyProductionListSelect;
    private applyProductionDetailSelect;
    getProductions(): Promise<Production[]>;
    getProductionById(productionId: number): Promise<Production>;
    createProduction(createProductionDTO: CreateProductionDTO): Promise<Production>;
    updateProduction(productionId: number, updateProductionDTO: UpdateProductionDTO): Promise<Production>;
    removeProduction(productionId: number): Promise<Production>;
    changeProductionStatus(productionId: number): Promise<Production>;
}
