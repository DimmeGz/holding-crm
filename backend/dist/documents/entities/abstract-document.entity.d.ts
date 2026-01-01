import { AbstractEntity } from '../../common/entities';
import { Company } from '../../companies/entities';
import { Currency } from '../../libs/entities';
export declare class AbstractDocumentEntity<T> extends AbstractEntity {
    seller: Company;
    sellerId: number;
    buyer: Company;
    buyerId: number;
    currency: Currency;
    currencyId: number;
    comment: string;
    status: boolean;
    createdAt: Date;
    createdById: number;
    constructor(entity: Partial<T>);
}
