import { DataSource, Repository } from 'typeorm';
import { GoodsService } from '../../goods';
import { ReceiveService } from '../receive';
import { TransitService } from '../transit';
import { WarehouseService } from '../../warehouse';
import { Shipment, ShipmentLine } from './entities';
import { CreateShipmentDTO, UpdateShipmentDTO } from './dto';
import { GetShipmentResponseDTO } from './dto/response-dto';
import { GetShipmentsQueryDTO } from './dto/query-dto';
export declare class ShipmentService {
    private readonly shipmentsRepository;
    private readonly shipmentLinessRepository;
    private dataSource;
    private readonly goodsService;
    private readonly receiveService;
    private readonly transitService;
    private readonly warehouseService;
    constructor(shipmentsRepository: Repository<Shipment>, shipmentLinessRepository: Repository<ShipmentLine>, dataSource: DataSource, goodsService: GoodsService, receiveService: ReceiveService, transitService: TransitService, warehouseService: WarehouseService);
    private createBaseQueryBuilder;
    private applyShipmentListSelect;
    private applyShipmentDetailSelect;
    private applyQueryFilter;
    getShipments(query?: GetShipmentsQueryDTO): Promise<Shipment[]>;
    getShipmentById(shipmentId: number): Promise<GetShipmentResponseDTO>;
    getShippedProductsByContract(contractId: number): Promise<{
        number?: number;
    }>;
    getShipmentsByInvoiceId(invoiceId: number): Promise<Shipment[]>;
    createShipment(createShipmentDTO: CreateShipmentDTO): Promise<Shipment>;
    private calculateDocumentSum;
    private getTechnicalProcesses;
    updateShipment(shipmentId: number, updateShipmentDTO: UpdateShipmentDTO): Promise<Shipment>;
    removeShipment(shipmentId: number): Promise<Shipment>;
    changeShipmentStatus(shipmentId: number): Promise<Shipment>;
    private updateWarehouseAccounting;
    private updateTransitLines;
}
