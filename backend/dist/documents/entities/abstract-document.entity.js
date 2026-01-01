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
exports.AbstractDocumentEntity = void 0;
const typeorm_1 = require("typeorm");
const entities_1 = require("../../common/entities");
const entities_2 = require("../../companies/entities");
const entities_3 = require("../../libs/entities");
class AbstractDocumentEntity extends entities_1.AbstractEntity {
    constructor(entity) {
        super();
        Object.assign(this, { ...entity, createdById: 1 });
    }
}
exports.AbstractDocumentEntity = AbstractDocumentEntity;
__decorate([
    (0, typeorm_1.ManyToOne)(() => entities_2.Company, {
        onDelete: 'RESTRICT',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'seller_id' }),
    __metadata("design:type", entities_2.Company)
], AbstractDocumentEntity.prototype, "seller", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'seller_id' }),
    __metadata("design:type", Number)
], AbstractDocumentEntity.prototype, "sellerId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => entities_2.Company, {
        onDelete: 'RESTRICT',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'buyer_id' }),
    __metadata("design:type", entities_2.Company)
], AbstractDocumentEntity.prototype, "buyer", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'buyer_id' }),
    __metadata("design:type", Number)
], AbstractDocumentEntity.prototype, "buyerId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => entities_3.Currency, {
        onDelete: 'RESTRICT',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'currency_id' }),
    __metadata("design:type", entities_3.Currency)
], AbstractDocumentEntity.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'currency_id' }),
    __metadata("design:type", Number)
], AbstractDocumentEntity.prototype, "currencyId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 200,
        nullable: true,
    }),
    __metadata("design:type", String)
], AbstractDocumentEntity.prototype, "comment", void 0);
__decorate([
    (0, typeorm_1.Column)({
        default: false,
    }),
    __metadata("design:type", Boolean)
], AbstractDocumentEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        precision: 0,
        type: 'timestamp',
        nullable: false,
        default: () => 'CURRENT_TIMESTAMP(6)',
        name: 'created_at',
    }),
    __metadata("design:type", Date)
], AbstractDocumentEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by_id' }),
    __metadata("design:type", Number)
], AbstractDocumentEntity.prototype, "createdById", void 0);
//# sourceMappingURL=abstract-document.entity.js.map