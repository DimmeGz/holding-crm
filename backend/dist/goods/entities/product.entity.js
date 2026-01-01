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
exports.Product = void 0;
const typeorm_1 = require("typeorm");
const custom_field_entity_1 = require("./custom-field.entity");
const batch_entity_1 = require("./batch.entity");
const entities_1 = require("../../common/entities");
const entities_2 = require("../../libs/entities");
let Product = class Product extends entities_1.AbstractEntity {
};
exports.Product = Product;
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 40,
        unique: true,
    }),
    __metadata("design:type", String)
], Product.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 70,
        nullable: true,
    }),
    __metadata("design:type", String)
], Product.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 70,
        nullable: true,
        name: 'description_2',
    }),
    __metadata("design:type", String)
], Product.prototype, "description2", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'cn_code',
        type: 'bigint',
        unsigned: true,
        nullable: true,
    }),
    __metadata("design:type", String)
], Product.prototype, "cnCode", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => entities_2.CountryOfOrigin, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'default_country_of_origin_id' }),
    __metadata("design:type", entities_2.CountryOfOrigin)
], Product.prototype, "countryOfOrigin", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 30,
        nullable: true,
    }),
    __metadata("design:type", String)
], Product.prototype, "cas", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => custom_field_entity_1.CustomField),
    (0, typeorm_1.JoinTable)({
        name: 'warehouse_product_custom_fields',
        joinColumn: {
            name: 'product_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'customfields_id',
            referencedColumnName: 'id',
        },
    }),
    __metadata("design:type", Array)
], Product.prototype, "customFields", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => batch_entity_1.Batch, (batch) => batch.product),
    __metadata("design:type", Array)
], Product.prototype, "batches", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => entities_2.TechnicalProcess),
    (0, typeorm_1.JoinTable)({
        name: 'warehouse_technicalprocess_product',
        joinColumn: {
            name: 'product_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'technicalprocess_id',
            referencedColumnName: 'id',
        },
    }),
    __metadata("design:type", Array)
], Product.prototype, "technicalProcesses", void 0);
exports.Product = Product = __decorate([
    (0, typeorm_1.Entity)({ name: 'warehouse_product' })
], Product);
//# sourceMappingURL=product.entity.js.map