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
exports.Account = void 0;
const typeorm_1 = require("typeorm");
const transformers_1 = require("../../common/transformers");
const entities_1 = require("../../common/entities");
const entities_2 = require("../../libs/entities");
const company_entity_1 = require("./company.entity");
let Account = class Account extends entities_1.AbstractEntity {
};
exports.Account = Account;
__decorate([
    (0, typeorm_1.ManyToOne)(() => company_entity_1.Company, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'company_id' }),
    __metadata("design:type", company_entity_1.Company)
], Account.prototype, "company", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'company_id' }),
    __metadata("design:type", Number)
], Account.prototype, "companyId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => entities_2.Currency, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'currency_id' }),
    __metadata("design:type", entities_2.Currency)
], Account.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'currency_id' }),
    __metadata("design:type", Number)
], Account.prototype, "currencyId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        default: 0,
        type: 'decimal',
        unsigned: true,
        precision: 13,
        scale: 2,
        transformer: new transformers_1.DecimalColumnTransformer(),
    }),
    __metadata("design:type", Number)
], Account.prototype, "balance", void 0);
__decorate([
    (0, typeorm_1.Column)({
        default: 0,
        type: 'decimal',
        unsigned: true,
        precision: 13,
        scale: 2,
        transformer: new transformers_1.DecimalColumnTransformer(),
    }),
    __metadata("design:type", Number)
], Account.prototype, "wait", void 0);
__decorate([
    (0, typeorm_1.Column)({
        default: 0,
        type: 'decimal',
        unsigned: true,
        precision: 13,
        scale: 2,
        transformer: new transformers_1.DecimalColumnTransformer(),
    }),
    __metadata("design:type", Number)
], Account.prototype, "debt", void 0);
exports.Account = Account = __decorate([
    (0, typeorm_1.Entity)({ name: 'companies_account' })
], Account);
//# sourceMappingURL=account.entity.js.map