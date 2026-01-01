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
exports.CreateInvoiceByContractDTO = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const base_invoice_dto_1 = require("./base-invoice.dto");
const create_invoice_line_by_contract_dto_1 = require("./create-invoice-line-by-contract.dto");
const dto_1 = require("../../common/dto");
class CreateInvoiceByContractDTO extends base_invoice_dto_1.BaseInvoiceDTO {
}
exports.CreateInvoiceByContractDTO = CreateInvoiceByContractDTO;
__decorate([
    (0, class_validator_1.IsPositive)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateInvoiceByContractDTO.prototype, "contractId", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayNotEmpty)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => create_invoice_line_by_contract_dto_1.CreateInvoiceLineByContractDTO),
    __metadata("design:type", Array)
], CreateInvoiceByContractDTO.prototype, "invoiceLines", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => dto_1.CreateServiceLineDTO),
    __metadata("design:type", Array)
], CreateInvoiceByContractDTO.prototype, "invoiceServiceLines", void 0);
//# sourceMappingURL=create-invoice-by-contract.dto.js.map