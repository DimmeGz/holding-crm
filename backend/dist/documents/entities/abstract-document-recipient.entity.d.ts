import { AbstractDocumentWarehouseEntity } from './abstract-document-warehouse.entity';
import { Company } from '../../companies/entities';
import { Warehouse } from '../../warehouse/entities';
export declare class AbstractDocumentRecipientEntity<T> extends AbstractDocumentWarehouseEntity<T> {
    recipient: Company;
    recipientWarehouse: Warehouse;
    recipientWarehouseId: number;
}
