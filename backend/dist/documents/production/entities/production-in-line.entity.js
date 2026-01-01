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
exports.ProductionInLine = void 0;
const typeorm_1 = require("typeorm");
const entities_1 = require("../../../common/entities");
const entities_2 = require("../../../goods/entities");
const production_entity_1 = require("./production.entity");
let ProductionInLine = class ProductionInLine extends entities_1.AbstractEntity {
};
exports.ProductionInLine = ProductionInLine;
__decorate([
    (0, typeorm_1.ManyToOne)(() => production_entity_1.Production, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'production_id' }),
    __metadata("design:type", production_entity_1.Production)
], ProductionInLine.prototype, "production", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => entities_2.Product, {
        onDelete: 'RESTRICT',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'product_id' }),
    __metadata("design:type", entities_2.Product)
], ProductionInLine.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_id' }),
    __metadata("design:type", Number)
], ProductionInLine.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => entities_2.Batch, {
        onDelete: 'RESTRICT',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'batch_id' }),
    __metadata("design:type", entities_2.Batch)
], ProductionInLine.prototype, "batch", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'batch_id' }),
    __metadata("design:type", Number)
], ProductionInLine.prototype, "batchId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => entities_2.Package, {
        onDelete: 'RESTRICT',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'package_id' }),
    __metadata("design:type", entities_2.Package)
], ProductionInLine.prototype, "package", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'package_id' }),
    __metadata("design:type", Number)
], ProductionInLine.prototype, "packageId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'int',
    }),
    __metadata("design:type", Number)
], ProductionInLine.prototype, "qty", void 0);
exports.ProductionInLine = ProductionInLine = __decorate([
    (0, typeorm_1.Entity)({ name: 'documents_productioninline' })
], ProductionInLine);
//# sourceMappingURL=production-in-line.entity.js.map