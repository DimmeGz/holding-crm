import { Receive } from '../../../receive/entities';
import { Shipment } from '../../entities';

export class GetShipmentResponseDTO {
  shipment: Shipment;
  receives: Receive[];
}
