"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCommissionInvoiceDTO = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_commission_invoice_dto_1 = require("./create-commission-invoice.dto");
class UpdateCommissionInvoiceDTO extends (0, mapped_types_1.OmitType)((0, mapped_types_1.PartialType)(create_commission_invoice_dto_1.CreateCommissionInvoiceDTO), ['invoiceId', 'buyerId']) {
}
exports.UpdateCommissionInvoiceDTO = UpdateCommissionInvoiceDTO;
//# sourceMappingURL=update-commission-invoice.dto.js.map