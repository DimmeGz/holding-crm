import { AbstractDocumentEntity } from '../../entities';
import { Incoterms, TechnicalProcess } from '../../../libs/entities';
import { Warehouse } from '../../../warehouse/entities';
import { ReceiveLine } from './receive-line.entity';
import { Shipment } from '../../shipment/entities';
import { ReceiveServiceLine } from './receive-service-line.entity';
export declare class Receive extends AbstractDocumentEntity<Receive> {
    incoterms: Incoterms;
    incotermsId: number;
    transportPlace: string;
    transportAmount: number;
    buyerWarehouse: Warehouse;
    buyerWarehouseId: number;
    expectedDate: Date;
    documentSum: number;
    shipment: Shipment;
    shipmentId: number;
    technicalProcesses: Partial<TechnicalProcess>[];
    receiveLines: Partial<ReceiveLine>[];
    receiveServiceLines: Partial<ReceiveServiceLine>[];
}
