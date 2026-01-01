"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePaymentDTO = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const decorators_1 = require("../../../common/decorators");
const base_payment_dto_1 = require("./base-payment.dto");
const create_payment_line_dto_1 = require("./create-payment-line.dto");
const update_payment_line_dto_1 = require("./update-payment-line.dto");
class UpdatePaymentDTO extends (0, mapped_types_1.PartialType)(base_payment_dto_1.BasePaymentDTO) {
}
exports.UpdatePaymentDTO = UpdatePaymentDTO;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayNotEmpty)(),
    (0, class_transformer_1.Type)(() => Object),
    (0, decorators_1.IsOneOfDtos)(create_payment_line_dto_1.CreatePaymentLineDTO, update_payment_line_dto_1.UpdatePaymentLineDTO),
    __metadata("design:type", Array)
], UpdatePaymentDTO.prototype, "paymentLines", void 0);
//# sourceMappingURL=update-payment.dto.js.map