import { Repository } from 'typeorm';
import { WarehouseAccounting } from './entities';
import { ChangeReceiveGoodsCountDTO, ChangeShipGoodsCountDTO, GetWareCostDTO, MakeProductionDTO, TransportProductsDTO } from './dto';
import { GetWarehouseQueryDTO } from './dto/query-dto';
export declare class WarehouseService {
    private readonly warehouseAccountingRepository;
    constructor(warehouseAccountingRepository: Repository<WarehouseAccounting>);
    private createBaseQueryBuilder;
    private applyWarehouseAccountingListSelect;
    private applyQueryFilter;
    getWarehouseAccountings(query?: GetWarehouseQueryDTO): Promise<WarehouseAccounting[]>;
    getWareCost(wareData: GetWareCostDTO): Promise<number>;
    private changeGoodsCount;
    decreaseShipGoodsCount(decreaseGoodsCountDTO: ChangeShipGoodsCountDTO): Promise<void>;
    returnShipGoodsCount(returnGoodsCountDTO: ChangeShipGoodsCountDTO): Promise<void>;
    increaseReceiveGoodsCount(increaseGoodsCountDTO: ChangeReceiveGoodsCountDTO): Promise<void>;
    returnReceiveGoodsCount(returnGoodsCountDTO: ChangeReceiveGoodsCountDTO): Promise<void>;
    transportProducts(transportDTO: TransportProductsDTO): Promise<void>;
    unTransportProducts(transportDTO: TransportProductsDTO): Promise<void>;
    makeProduction(makeProductionDTO: MakeProductionDTO): Promise<void>;
}
