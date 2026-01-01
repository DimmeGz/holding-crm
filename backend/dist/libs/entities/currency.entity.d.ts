import { Account } from '../../companies/entities';
import { AbstractEntity } from '../../common/entities';
export declare class Currency extends AbstractEntity {
    name: string;
    accounts: Account[];
}
