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
exports.UpdateShipmentDTO = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const decorators_1 = require("../../../common/decorators");
const base_shipment_dto_1 = require("./base-shipment.dto");
const dto_1 = require("../../common/dto");
const create_shipment_line_dto_1 = require("./create-shipment-line.dto");
const update_shipment_line_dto_1 = require("./update-shipment-line.dto");
class UpdateShipmentDTO extends base_shipment_dto_1.BaseShipmentDTO {
}
exports.UpdateShipmentDTO = UpdateShipmentDTO;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayNotEmpty)(),
    (0, class_transformer_1.Type)(() => Object),
    (0, decorators_1.IsOneOfDtos)(create_shipment_line_dto_1.CreateShipmentLineDTO, update_shipment_line_dto_1.UpdateShipmentLineDTO),
    __metadata("design:type", Array)
], UpdateShipmentDTO.prototype, "shipmentLines", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_transformer_1.Type)(() => Object),
    (0, decorators_1.IsOneOfDtos)(dto_1.CreateServiceLineDTO, dto_1.UpdateServiceLineDTO),
    __metadata("design:type", Array)
], UpdateShipmentDTO.prototype, "shipmentServiceLines", void 0);
//# sourceMappingURL=update-shipment.dto.js.map