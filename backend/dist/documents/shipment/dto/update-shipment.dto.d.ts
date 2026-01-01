import { BaseShipmentDTO } from './base-shipment.dto';
import { CreateServiceLineDTO, UpdateServiceLineDTO } from '../../common/dto';
import { CreateShipmentLineDTO } from './create-shipment-line.dto';
import { UpdateShipmentLineDTO } from './update-shipment-line.dto';
export declare class UpdateShipmentDTO extends BaseShipmentDTO {
    shipmentLines: (CreateShipmentLineDTO | UpdateShipmentLineDTO)[];
    shipmentServiceLines: (CreateServiceLineDTO | UpdateServiceLineDTO)[];
}
