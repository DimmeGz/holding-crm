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
exports.CreateProductionDTO = void 0;
const class_validator_1 = require("class-validator");
const base_production_dto_1 = require("./base-production.dto");
const create_production_in_line_dto_1 = require("./create-production-in-line.dto");
const create_production_out_line_dto_1 = require("./create-production-out-line.dto");
const class_transformer_1 = require("class-transformer");
class CreateProductionDTO extends base_production_dto_1.BaseProductionDTO {
}
exports.CreateProductionDTO = CreateProductionDTO;
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayNotEmpty)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => create_production_out_line_dto_1.CreateProductionOutLineDTO),
    __metadata("design:type", Array)
], CreateProductionDTO.prototype, "productionOutLines", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayNotEmpty)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => create_production_in_line_dto_1.CreateProductionInLineDTO),
    __metadata("design:type", Array)
], CreateProductionDTO.prototype, "productionInLines", void 0);
//# sourceMappingURL=create-production.dto.js.map