"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCommissionPaymentDTO = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_commission_payment_dto_1 = require("./create-commission-payment.dto");
class UpdateCommissionPaymentDTO extends (0, mapped_types_1.PickType)((0, mapped_types_1.PartialType)(create_commission_payment_dto_1.CreateCommissionPaymentDTO), ['expectedDate', 'amount']) {
}
exports.UpdateCommissionPaymentDTO = UpdateCommissionPaymentDTO;
//# sourceMappingURL=update-commission-payment.dto.js.map