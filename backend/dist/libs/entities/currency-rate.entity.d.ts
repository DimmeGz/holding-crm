import { AbstractEntity } from '../../common/entities';
import { Currency } from './currency.entity';
export declare class CurrencyRate extends AbstractEntity {
    date: Date;
    baseCurrency: Currency;
    quoteCurrency: Currency;
    rate: number;
}
