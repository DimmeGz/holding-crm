import { AbstractEntity } from '../../../common/entities';
import { Shipment } from '../../shipment/entities';
import { Receive } from '../../receive/entities';
import { TechnicalProcess } from '../../../libs/entities';
import { Batch, Package } from '../../../goods/entities';
export declare class TransitLine extends AbstractEntity {
    shipment: Shipment;
    shipmentId: number;
    batch: Batch;
    batchId: number;
    package: Package;
    packageId: number;
    qty: number;
    receive?: Receive;
    receiveId?: number;
    technicalProcesses: Partial<TechnicalProcess>[];
    constructor(entity: Partial<TransitLine>);
}
