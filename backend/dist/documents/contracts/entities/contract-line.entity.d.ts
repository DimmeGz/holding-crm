import { AbstractLineEntity } from '../../entities';
import { Contract } from './contract.entity';
import { Product } from '../../../goods/entities';
export declare class ContractLine extends AbstractLineEntity {
    contract: Contract;
    product: Product;
    productId: number;
    shipQty: number;
    qty: number;
}
