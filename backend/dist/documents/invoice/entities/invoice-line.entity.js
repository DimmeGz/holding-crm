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
exports.InvoiceLine = void 0;
const typeorm_1 = require("typeorm");
const transformers_1 = require("../../../common/transformers");
const entities_1 = require("../../entities");
const invoice_entity_1 = require("./invoice.entity");
const entities_2 = require("../../../goods/entities");
const entities_3 = require("../../../libs/entities");
const entities_4 = require("../../orders/entities");
let InvoiceLine = class InvoiceLine extends entities_1.AbstractLineEntity {
};
exports.InvoiceLine = InvoiceLine;
__decorate([
    (0, typeorm_1.ManyToOne)(() => invoice_entity_1.Invoice, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'invoice_id' }),
    __metadata("design:type", invoice_entity_1.Invoice)
], InvoiceLine.prototype, "invoice", void 0);
__decorate([
    (0, typeorm_1.JoinColumn)({ name: 'invoice_id' }),
    __metadata("design:type", Number)
], InvoiceLine.prototype, "invoiceId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        unsigned: true,
        precision: 12,
        scale: 3,
        transformer: new transformers_1.DecimalColumnTransformer(),
    }),
    __metadata("design:type", Number)
], InvoiceLine.prototype, "cost", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => entities_2.Product, {
        onDelete: 'RESTRICT',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'product_id' }),
    __metadata("design:type", entities_2.Product)
], InvoiceLine.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_id' }),
    __metadata("design:type", Number)
], InvoiceLine.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => entities_2.Batch, {
        onDelete: 'RESTRICT',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'batch_id' }),
    __metadata("design:type", entities_2.Batch)
], InvoiceLine.prototype, "batch", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'batch_id' }),
    __metadata("design:type", Number)
], InvoiceLine.prototype, "batchId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => entities_2.Package, {
        onDelete: 'RESTRICT',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'package_id' }),
    __metadata("design:type", entities_2.Package)
], InvoiceLine.prototype, "package", void 0);
__decorate([
    (0, typeorm_1.JoinColumn)({ name: 'package_id' }),
    __metadata("design:type", Number)
], InvoiceLine.prototype, "packageId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => entities_3.CountryOfOrigin, {
        onDelete: 'RESTRICT',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'country_of_origin_id' }),
    __metadata("design:type", entities_3.CountryOfOrigin)
], InvoiceLine.prototype, "countryOfOrigin", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'country_of_origin_id' }),
    __metadata("design:type", Number)
], InvoiceLine.prototype, "countryOfOriginId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => entities_4.Order, {
        onDelete: 'RESTRICT',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'order_id' }),
    __metadata("design:type", entities_4.Order)
], InvoiceLine.prototype, "order", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'order_id' }),
    __metadata("design:type", Number)
], InvoiceLine.prototype, "orderId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'pallets_qty',
        type: 'smallint',
        unsigned: true,
    }),
    __metadata("design:type", Number)
], InvoiceLine.prototype, "palletsQty", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'gross_weight',
        type: 'decimal',
        unsigned: true,
        precision: 8,
        scale: 2,
        nullable: true,
        transformer: new transformers_1.DecimalColumnTransformer(),
    }),
    __metadata("design:type", Number)
], InvoiceLine.prototype, "grossWeight", void 0);
exports.InvoiceLine = InvoiceLine = __decorate([
    (0, typeorm_1.Entity)({ name: 'documents_invoiceline' })
], InvoiceLine);
//# sourceMappingURL=invoice-line.entity.js.map