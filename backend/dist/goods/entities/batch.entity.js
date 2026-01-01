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
exports.Batch = void 0;
const typeorm_1 = require("typeorm");
const entities_1 = require("../../common/entities");
const entities_2 = require("../../libs/entities");
const product_entity_1 = require("./product.entity");
const entities_3 = require("../../documents/invoice/entities");
const entities_4 = require("../../documents/production/entities");
let Batch = class Batch extends entities_1.AbstractEntity {
};
exports.Batch = Batch;
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_entity_1.Product, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'product_id' }),
    __metadata("design:type", product_entity_1.Product)
], Batch.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 16,
        unique: true,
    }),
    __metadata("design:type", String)
], Batch.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_archived', default: false }),
    __metadata("design:type", Boolean)
], Batch.prototype, "isArchived", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => entities_2.CountryOfOrigin, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'default_country_of_origin_id' }),
    __metadata("design:type", entities_2.CountryOfOrigin)
], Batch.prototype, "countryOfOrigin", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => entities_3.InvoiceLine, (invoiceLine) => invoiceLine.batch),
    __metadata("design:type", Array)
], Batch.prototype, "invoiceLines", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => entities_4.ProductionInLine, (productionInLine) => productionInLine.batch),
    __metadata("design:type", Array)
], Batch.prototype, "productionInLines", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => entities_4.ProductionOutLine, (productionOutLine) => productionOutLine.batch),
    __metadata("design:type", Array)
], Batch.prototype, "productionOutLines", void 0);
exports.Batch = Batch = __decorate([
    (0, typeorm_1.Entity)({ name: 'warehouse_batch' })
], Batch);
//# sourceMappingURL=batch.entity.js.map