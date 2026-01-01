import { AbstractEntity } from '../../../common/entities';
import { Company } from '../../../companies/entities';
import { Warehouse } from '../../../warehouse/entities';
import { TechnicalProcess } from '../../../libs/entities';
import { ProductionInLine } from './production-in-line.entity';
import { ProductionOutLine } from './production-out-line.entity';
export declare class Production extends AbstractEntity {
    company: Company;
    companyId: number;
    warehouse: Warehouse;
    warehouseId: number;
    expectedDate: Date;
    status: boolean;
    createdAt: Date;
    comment: string;
    technicalProcesses: TechnicalProcess[];
    productionInLines: ProductionInLine[];
    productionOutLines: ProductionOutLine[];
    createdById: number;
    constructor(entity: any);
}
