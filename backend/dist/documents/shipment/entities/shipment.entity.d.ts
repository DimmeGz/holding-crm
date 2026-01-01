import { AbstractDocumentEntity } from '../../entities';
import { Incoterms, TechnicalProcess } from '../../../libs/entities';
import { Warehouse } from '../../../warehouse/entities';
import { Invoice } from '../../invoice/entities';
import { ShipmentLine } from './shipment-line.entity';
import { ShipmentServiceLine } from './shipment-service-line.entity';
import { Receive } from '../../receive/entities';
export declare class Shipment extends AbstractDocumentEntity<Shipment> {
    incoterms: Incoterms;
    incotermsId: number;
    transportPlace: string;
    transportAmount: number;
    sellerWarehouse: Warehouse;
    sellerWarehouseId: number;
    expectedDate: Date;
    documentSum: number;
    invoice: Invoice;
    invoiceId: number;
    technicalProcesses: Partial<TechnicalProcess>[];
    shipmentLines: Partial<ShipmentLine>[];
    shipmentServiceLines: Partial<ShipmentServiceLine>[];
    receives: Receive[];
}
