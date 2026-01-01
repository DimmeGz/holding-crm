export declare class CreateOrderConfirmationDTO {
    orderId: number;
    sellerId: number;
    buyerId: number;
    currencyId: number;
    sellerWarehouseId: number;
    buyerWarehouseId: number;
    recipientId: number;
    recipientWarehouseId: number;
    paymentDelay: number;
    confirmationNumber: string;
    expectedDate: Date;
    incotermsId: number;
    transportPlace: string;
    comment?: string;
}
