import { Order } from '../../../orders/entities';
import { Contract } from '../../entities';

export class GetContractResponseDTO {
  contract: Contract;
  orders: Order[];
}
