import { AbstractEntity } from '../../common/entities';
import { Currency } from '../../libs/entities';
import { Company } from './company.entity';
export declare class Account extends AbstractEntity {
    company: Company;
    companyId: number;
    currency: Currency;
    currencyId: number;
    balance: number;
    wait: number;
    debt: number;
}
