import { Receive } from '../../../receive/entities';
import { Shipment } from '../../entities';
export declare class GetShipmentResponseDTO {
    shipment: Shipment;
    receives: Receive[];
}
