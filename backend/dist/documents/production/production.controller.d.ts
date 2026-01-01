import { ProductionService } from './production.service';
import { Production } from './entities';
import { CreateProductionDTO, UpdateProductionDTO } from './dto';
export declare class ProductionController {
    private readonly productionService;
    constructor(productionService: ProductionService);
    getProductions(): Promise<Production[]>;
    getProductionById(productionId: number): Promise<Production>;
    createProduction(createProductionDTO: CreateProductionDTO): Promise<Production>;
    updateProduction(productionId: number, updateProductionDTO: UpdateProductionDTO): Promise<Production>;
    removeProduction(productionId: number): Promise<Production>;
    changeProductionStatus(productionId: number): Promise<Production>;
}
