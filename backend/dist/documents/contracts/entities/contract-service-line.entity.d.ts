import { AbstractServiceLineEntity } from '../../entities';
import { Contract } from './contract.entity';
import { Service } from '../../../goods/entities';
export declare class ContractServiceLine extends AbstractServiceLineEntity {
    contract: Contract;
    service: Service;
    serviceId: number;
}
