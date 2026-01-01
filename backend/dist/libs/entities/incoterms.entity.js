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
exports.Incoterms = void 0;
const typeorm_1 = require("typeorm");
const entities_1 = require("../../common/entities");
const enums_1 = require("../enums");
let Incoterms = class Incoterms extends entities_1.AbstractEntity {
};
exports.Incoterms = Incoterms;
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 3 }),
    __metadata("design:type", String)
], Incoterms.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'payer',
        type: 'enum',
        enum: enums_1.PayerType,
    }),
    __metadata("design:type", String)
], Incoterms.prototype, "payerType", void 0);
exports.Incoterms = Incoterms = __decorate([
    (0, typeorm_1.Entity)({ name: 'documents_incoterms' })
], Incoterms);
//# sourceMappingURL=incoterms.entity.js.map