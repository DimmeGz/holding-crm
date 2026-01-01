export declare class BaseReceiveDTO {
    sellerId: number;
    buyerId: number;
    buyerWarehouseId: number;
    expectedDate: Date;
    currencyId: number;
    shipmentId: number;
    incotermsId: number;
    transportPlace?: string;
    transportAmount?: number;
    comment: string;
}
