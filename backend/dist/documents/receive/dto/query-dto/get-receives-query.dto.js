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
exports.GetReceivesQueryDTO = void 0;
const class_validator_1 = require("class-validator");
const query_dto_1 = require("../../../common/dto/query-dto");
class GetReceivesQueryDTO extends query_dto_1.BaseDocumentsQueryDTO {
}
exports.GetReceivesQueryDTO = GetReceivesQueryDTO;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Matches)(/^old$|^((202[2-9])|(20[3-9]\d)|([2-9]\d{3}))-(1|2|3|4)$/, {
        message: (args) => {
            return `${args.property} must be 'old' or match the pattern YYYY-Q (year >= 2022, Q: 1-4), e.g., 2025-1`;
        },
    }),
    __metadata("design:type", String)
], GetReceivesQueryDTO.prototype, "date", void 0);
//# sourceMappingURL=get-receives-query.dto.js.map