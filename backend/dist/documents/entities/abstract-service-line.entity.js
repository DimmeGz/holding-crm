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
exports.AbstractServiceLineEntity = void 0;
const typeorm_1 = require("typeorm");
const transformers_1 = require("../../common/transformers");
const entities_1 = require("../../common/entities");
let AbstractServiceLineEntity = class AbstractServiceLineEntity extends entities_1.AbstractEntity {
};
exports.AbstractServiceLineEntity = AbstractServiceLineEntity;
__decorate([
    (0, typeorm_1.Column)({ type: 'smallint', unsigned: true, default: 1 }),
    __metadata("design:type", Number)
], AbstractServiceLineEntity.prototype, "qty", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        unsigned: true,
        precision: 12,
        scale: 3,
        transformer: new transformers_1.DecimalColumnTransformer(),
    }),
    __metadata("design:type", Number)
], AbstractServiceLineEntity.prototype, "price", void 0);
exports.AbstractServiceLineEntity = AbstractServiceLineEntity = __decorate([
    (0, typeorm_1.Entity)()
], AbstractServiceLineEntity);
//# sourceMappingURL=abstract-service-line.entity.js.map