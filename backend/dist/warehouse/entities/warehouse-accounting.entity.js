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
exports.WarehouseAccounting = void 0;
const typeorm_1 = require("typeorm");
const transformers_1 = require("../../common/transformers");
const entities_1 = require("../../common/entities");
const entities_2 = require("../../goods/entities");
const entities_3 = require("../../companies/entities");
const entities_4 = require("../../libs/entities");
const warehouse_entity_1 = require("./warehouse.entity");
let WarehouseAccounting = class WarehouseAccounting extends entities_1.AbstractEntity {
    constructor(entity) {
        super();
        Object.assign(this, entity);
    }
};
exports.WarehouseAccounting = WarehouseAccounting;
__decorate([
    (0, typeorm_1.ManyToOne)(() => entities_2.Batch, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'batch_id' }),
    __metadata("design:type", entities_2.Batch)
], WarehouseAccounting.prototype, "batch", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'batch_id' }),
    __metadata("design:type", Number)
], WarehouseAccounting.prototype, "batchId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => entities_2.Package, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'package_id' }),
    __metadata("design:type", entities_2.Package)
], WarehouseAccounting.prototype, "package", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'package_id' }),
    __metadata("design:type", Number)
], WarehouseAccounting.prototype, "packageId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => warehouse_entity_1.Warehouse, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'warehouse_id' }),
    __metadata("design:type", warehouse_entity_1.Warehouse)
], WarehouseAccounting.prototype, "warehouse", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'warehouse_id' }),
    __metadata("design:type", Number)
], WarehouseAccounting.prototype, "warehouseId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => entities_3.Company, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'company_id' }),
    __metadata("design:type", entities_3.Company)
], WarehouseAccounting.prototype, "company", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'company_id' }),
    __metadata("design:type", Number)
], WarehouseAccounting.prototype, "companyId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'int',
    }),
    __metadata("design:type", Number)
], WarehouseAccounting.prototype, "qty", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        unsigned: true,
        precision: 8,
        scale: 2,
        default: 0,
        transformer: new transformers_1.DecimalColumnTransformer(),
    }),
    __metadata("design:type", Number)
], WarehouseAccounting.prototype, "cost", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => entities_4.Currency, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'currency_id' }),
    __metadata("design:type", entities_4.Currency)
], WarehouseAccounting.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'currency_id' }),
    __metadata("design:type", Number)
], WarehouseAccounting.prototype, "currencyId", void 0);
exports.WarehouseAccounting = WarehouseAccounting = __decorate([
    (0, typeorm_1.Entity)({ name: 'warehouse_warehouseaccounting' }),
    __metadata("design:paramtypes", [Object])
], WarehouseAccounting);
//# sourceMappingURL=warehouse-accounting.entity.js.map