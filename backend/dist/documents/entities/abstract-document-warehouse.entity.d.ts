import { AbstractDocumentEntity } from './abstract-document.entity';
import { Warehouse } from '../../warehouse/entities';
export declare class AbstractDocumentWarehouseEntity<T> extends AbstractDocumentEntity<T> {
    sellerWarehouse: Warehouse;
    sellerWarehouseId: number;
    buyerWarehouse: Warehouse;
    buyerWarehouseId: number;
}
