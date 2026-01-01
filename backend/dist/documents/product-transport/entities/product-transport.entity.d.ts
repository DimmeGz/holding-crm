import { AbstractEntity } from '../../../common/entities';
import { Company } from '../../../companies/entities';
import { Warehouse } from '../../../warehouse/entities';
import { TechnicalProcess } from '../../../libs/entities';
import { ProductTransportLine } from './product-transport-line.entity';
import { ProductTransportServiceLine } from './product-transport-service-line.entity';
export declare class ProductTransport extends AbstractEntity {
    company: Company;
    companyId: number;
    warehouseSender: Warehouse;
    warehouseSenderId: number;
    warehouseReceive: Warehouse;
    warehouseReceiveId: number;
    comment: string;
    createdAt: Date;
    expectedDate: Date;
    status: boolean;
    technicalProcesses: TechnicalProcess[];
    productTransportLines: ProductTransportLine[];
    productTransportServiceLines: ProductTransportServiceLine[];
    createdById: number;
    constructor(entity: any);
}
