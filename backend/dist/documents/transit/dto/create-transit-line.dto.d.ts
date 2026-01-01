import { BaseLineDTO } from './base-line.dto';
export declare class CreateTransitLinesDTO {
    shipmentId: number;
    lines: Partial<BaseLineDTO>[];
}
