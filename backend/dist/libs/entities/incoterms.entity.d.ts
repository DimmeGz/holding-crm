import { AbstractEntity } from '../../common/entities';
import { PayerType } from '../enums';
export declare class Incoterms extends AbstractEntity {
    name: string;
    payerType: PayerType;
}
