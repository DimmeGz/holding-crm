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
exports.UpdateProductTransportDTO = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const decorators_1 = require("../../../common/decorators");
const dto_1 = require("../../common/dto");
const base_product_transport_dto_1 = require("./base-product-transport.dto");
const create_product_transport_line_dto_1 = require("./create-product-transport-line.dto");
const update_product_transport_line_dto_1 = require("./update-product-transport-line.dto");
class UpdateProductTransportDTO extends (0, mapped_types_1.PartialType)(base_product_transport_dto_1.BaseProductTransportDTO) {
}
exports.UpdateProductTransportDTO = UpdateProductTransportDTO;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayNotEmpty)(),
    (0, class_transformer_1.Type)(() => Object),
    (0, decorators_1.IsOneOfDtos)(create_product_transport_line_dto_1.CreateProductTransportLineDTO, update_product_transport_line_dto_1.UpdateProductTransportLineDTO),
    __metadata("design:type", Array)
], UpdateProductTransportDTO.prototype, "productTransportLines", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_transformer_1.Type)(() => Object),
    (0, decorators_1.IsOneOfDtos)(dto_1.CreateServiceLineDTO, dto_1.UpdateServiceLineDTO),
    __metadata("design:type", Array)
], UpdateProductTransportDTO.prototype, "productTransportServiceLines", void 0);
//# sourceMappingURL=update-product-transport.dto.js.map