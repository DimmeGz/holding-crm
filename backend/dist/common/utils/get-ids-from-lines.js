"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductIdsFromProductLines = getProductIdsFromProductLines;
exports.getProductIdsFromOrderProductLines = getProductIdsFromOrderProductLines;
exports.getServiceIdsFromServiceLines = getServiceIdsFromServiceLines;
function getProductIdsFromProductLines(lines) {
    return [...new Set(lines.map((line) => line.productId))];
}
function getProductIdsFromOrderProductLines(lines) {
    const productManIds = lines.map((line) => line.productManId);
    const productBuyIds = lines.map((line) => line.productBuyId);
    return [...new Set([...productManIds, ...productBuyIds])];
}
function getServiceIdsFromServiceLines(lines) {
    return [...new Set(lines.map((line) => line.serviceId))];
}
//# sourceMappingURL=get-ids-from-lines.js.map