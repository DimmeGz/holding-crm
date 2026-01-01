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
exports.ContractLine = void 0;
const typeorm_1 = require("typeorm");
const entities_1 = require("../../entities");
const contract_entity_1 = require("./contract.entity");
const entities_2 = require("../../../goods/entities");
let ContractLine = class ContractLine extends entities_1.AbstractLineEntity {
};
exports.ContractLine = ContractLine;
__decorate([
    (0, typeorm_1.ManyToOne)(() => contract_entity_1.Contract, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'contract_id' }),
    __metadata("design:type", contract_entity_1.Contract)
], ContractLine.prototype, "contract", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => entities_2.Product, {
        onDelete: 'RESTRICT',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'product_id' }),
    __metadata("design:type", entities_2.Product)
], ContractLine.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_id' }),
    __metadata("design:type", Number)
], ContractLine.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ship_qty', type: 'smallint', unsigned: true, default: 1 }),
    __metadata("design:type", Number)
], ContractLine.prototype, "shipQty", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'smallint', unsigned: true, default: 1 }),
    __metadata("design:type", Number)
], ContractLine.prototype, "qty", void 0);
exports.ContractLine = ContractLine = __decorate([
    (0, typeorm_1.Entity)({ name: 'documents_contractline' })
], ContractLine);
//# sourceMappingURL=contract-line.entity.js.map