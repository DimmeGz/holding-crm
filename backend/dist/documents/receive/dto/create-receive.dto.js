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
exports.CreateReveiveDTO = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const base_receive_dto_1 = require("./base-receive.dto");
const dto_1 = require("../../common/dto");
const create_receive_line_dto_1 = require("./create-receive-line.dto");
class CreateReveiveDTO extends base_receive_dto_1.BaseReceiveDTO {
}
exports.CreateReveiveDTO = CreateReveiveDTO;
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayNotEmpty)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => create_receive_line_dto_1.CreateReceiveLineDTO),
    __metadata("design:type", Array)
], CreateReveiveDTO.prototype, "receiveLines", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => dto_1.CreateServiceLineDTO),
    __metadata("design:type", Array)
], CreateReveiveDTO.prototype, "receiveServiceLines", void 0);
//# sourceMappingURL=create-receive.dto.js.map