import { BaseShipmentDTO } from './base-shipment.dto';
import { CreateServiceLineDTO } from '../../common/dto';
import { CreateShipmentLineDTO } from './create-shipment-line.dto';
export declare class CreateShipmentDTO extends BaseShipmentDTO {
    shipmentLines: CreateShipmentLineDTO[];
    shipmentServiceLines: CreateServiceLineDTO[];
}
