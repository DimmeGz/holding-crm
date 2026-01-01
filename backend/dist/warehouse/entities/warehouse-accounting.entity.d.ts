import { AbstractEntity } from '../../common/entities';
import { Batch, Package } from '../../goods/entities';
import { Company } from '../../companies/entities';
import { Currency } from '../../libs/entities';
import { Warehouse } from './warehouse.entity';
export declare class WarehouseAccounting extends AbstractEntity {
    batch: Batch;
    batchId: number;
    package: Package;
    packageId: number;
    warehouse: Warehouse;
    warehouseId: number;
    company: Company;
    companyId: number;
    qty: number;
    cost: number;
    currency: Currency;
    currencyId: number;
    constructor(entity: Partial<WarehouseAccounting>);
}
