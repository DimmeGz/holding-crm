import { ProductLine } from './product-line.dto';
export declare class TransportProductsDTO {
    companyId: number;
    warehouseSenderId: number;
    warehouseReceiveId: number;
    transportLines: ProductLine[];
    transportCost: number;
}
