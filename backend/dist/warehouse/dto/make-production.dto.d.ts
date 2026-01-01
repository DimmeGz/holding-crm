import { ProductLine } from './product-line.dto';
export declare class MakeProductionDTO {
    status: boolean;
    companyId: number;
    warehouseId: number;
    outLines: ProductLine[];
    inLines: ProductLine[];
}
