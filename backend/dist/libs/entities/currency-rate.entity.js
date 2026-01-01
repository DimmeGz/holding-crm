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
exports.CurrencyRate = void 0;
const typeorm_1 = require("typeorm");
const transformers_1 = require("../../common/transformers");
const entities_1 = require("../../common/entities");
const currency_entity_1 = require("./currency.entity");
let CurrencyRate = class CurrencyRate extends entities_1.AbstractEntity {
};
exports.CurrencyRate = CurrencyRate;
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], CurrencyRate.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => currency_entity_1.Currency, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'base_currency_id' }),
    __metadata("design:type", currency_entity_1.Currency)
], CurrencyRate.prototype, "baseCurrency", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => currency_entity_1.Currency, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'quote_currency_id' }),
    __metadata("design:type", currency_entity_1.Currency)
], CurrencyRate.prototype, "quoteCurrency", void 0);
__decorate([
    (0, typeorm_1.Column)({
        default: 0,
        type: 'decimal',
        unsigned: true,
        precision: 6,
        scale: 4,
        transformer: new transformers_1.DecimalColumnTransformer(),
    }),
    __metadata("design:type", Number)
], CurrencyRate.prototype, "rate", void 0);
exports.CurrencyRate = CurrencyRate = __decorate([
    (0, typeorm_1.Entity)({ name: 'companies_currencyrate' })
], CurrencyRate);
//# sourceMappingURL=currency-rate.entity.js.map