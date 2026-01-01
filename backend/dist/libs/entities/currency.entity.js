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
exports.Currency = void 0;
const typeorm_1 = require("typeorm");
const entities_1 = require("../../companies/entities");
const entities_2 = require("../../common/entities");
let Currency = class Currency extends entities_2.AbstractEntity {
};
exports.Currency = Currency;
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 3 }),
    __metadata("design:type", String)
], Currency.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => entities_1.Account, (account) => account.currency),
    __metadata("design:type", Array)
], Currency.prototype, "accounts", void 0);
exports.Currency = Currency = __decorate([
    (0, typeorm_1.Entity)({ name: 'companies_currency' })
], Currency);
//# sourceMappingURL=currency.entity.js.map