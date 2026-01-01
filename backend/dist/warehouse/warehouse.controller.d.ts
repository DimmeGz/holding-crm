import { WarehouseService } from './warehouse.service';
import { GetWarehouseQueryDTO } from './dto/query-dto';
import { WarehouseAccounting } from './entities';
export declare class WarehouseController {
    private readonly warehouseService;
    constructor(warehouseService: WarehouseService);
    getWarehouseAccountings(query?: GetWarehouseQueryDTO): Promise<WarehouseAccounting[]>;
}
