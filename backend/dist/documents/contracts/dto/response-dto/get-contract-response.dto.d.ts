import { Order } from '../../../orders/entities';
import { Contract } from '../../entities';
export declare class GetContractResponseDTO {
    contract: Contract;
    orders: Order[];
}
