export declare class BaseShipmentDTO {
    sellerId: number;
    sellerWarehouseId: number;
    buyerId: number;
    expectedDate: Date;
    currencyId: number;
    invoiceId: number;
    incotermsId: number;
    transportPlace?: string;
    transportAmount?: number;
    comment: string;
}
