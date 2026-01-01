export declare function getProductIdsFromProductLines(lines: ({
    productId: number;
} & Record<string, any>)[]): number[];
export declare function getProductIdsFromOrderProductLines(lines: ({
    productManId: number;
    productBuyId: number;
} & Record<string, any>)[]): number[];
export declare function getServiceIdsFromServiceLines(lines: ({
    serviceId: number;
} & Record<string, any>)[]): number[];
