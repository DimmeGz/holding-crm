export declare class BaseOrderDTO {
    orderNumber: string;
    contractId: number;
    signatureDate?: Date;
    sellerId: number;
    sellerWarehouseId: number;
    buyerId: number;
    buyerWarehouseId: number;
    recipientId?: number;
    recipientWarehouseId?: number;
    expectedDate?: Date;
    isDateAsap?: boolean;
    currencyId: number;
    vat?: number;
    paymentDelay: number;
    incotermsId: number;
    transportPlace?: string;
    carPlate?: string;
    comment?: string;
    isHidden?: boolean;
}
