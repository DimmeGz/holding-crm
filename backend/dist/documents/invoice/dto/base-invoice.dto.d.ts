export declare class BaseInvoiceDTO {
    sellerId: number;
    sellerWarehouseId: number;
    buyerId: number;
    buyerWarehouseId: number;
    recipientId?: number;
    recipientWarehouseId?: number;
    expectedDate: Date;
    currencyId: number;
    vat?: number;
    paymentDelay?: number;
    invoiceId?: number;
    incotermsId: number;
    transportPlace?: string;
    carPlate: string;
    ponz?: number;
    grossWeight?: number;
    transportAmount?: number;
    comment: string;
    contractInfo?: string;
    reportPeriod?: Date;
    separation?: boolean;
    invoiceNumber: string;
    reportDuplicating: boolean;
}
