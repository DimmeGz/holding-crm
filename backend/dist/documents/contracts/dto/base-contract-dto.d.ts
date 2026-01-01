export declare class BaseContractDTO {
    name: string;
    parentId?: number;
    sellerId: number;
    buyerId: number;
    signatureDate: Date;
    term?: Date;
    currencyId: number;
    vat: number;
    paymentDelay: number;
    incotermsId: number;
    transportPlace: string;
    orderPrefix: string;
    comment: string;
}
