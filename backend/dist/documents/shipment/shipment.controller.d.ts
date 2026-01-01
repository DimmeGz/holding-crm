import { ShipmentService } from './shipment.service';
import { Shipment } from './entities';
import { CreateShipmentDTO, UpdateShipmentDTO } from './dto';
import { GetShipmentsQueryDTO } from './dto/query-dto';
import { GetShipmentResponseDTO } from './dto/response-dto';
export declare class ShipmentController {
    private readonly shipmentService;
    constructor(shipmentService: ShipmentService);
    getShipments(query?: GetShipmentsQueryDTO): Promise<Shipment[]>;
    getShipmentById(shipmentId: number): Promise<GetShipmentResponseDTO>;
    createShipment(createShipmentDTO: CreateShipmentDTO): Promise<Shipment>;
    updateShipment(shipmentId: number, updateShipmentDTO: UpdateShipmentDTO): Promise<Shipment>;
    removeShipment(shipmentId: number): Promise<Shipment>;
    changeShipmentStatus(shipmentId: number): Promise<Shipment>;
}
