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
exports.PaymentLine = void 0;
const typeorm_1 = require("typeorm");
const transformers_1 = require("../../../common/transformers");
const entities_1 = require("../../../common/entities");
const payment_entity_1 = require("./payment.entity");
const entities_2 = require("../../invoice/entities");
let PaymentLine = class PaymentLine extends entities_1.AbstractEntity {
};
exports.PaymentLine = PaymentLine;
__decorate([
    (0, typeorm_1.ManyToOne)(() => payment_entity_1.Payment, {
        onDelete: 'RESTRICT',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'payment_id' }),
    __metadata("design:type", payment_entity_1.Payment)
], PaymentLine.prototype, "payment", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => entities_2.Invoice, {
        onDelete: 'RESTRICT',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'invoice_id' }),
    __metadata("design:type", entities_2.Invoice)
], PaymentLine.prototype, "invoice", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'invoice_id' }),
    __metadata("design:type", Number)
], PaymentLine.prototype, "invoiceId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        unsigned: true,
        precision: 13,
        scale: 3,
        transformer: new transformers_1.DecimalColumnTransformer(),
    }),
    __metadata("design:type", Number)
], PaymentLine.prototype, "amount", void 0);
exports.PaymentLine = PaymentLine = __decorate([
    (0, typeorm_1.Entity)({ name: 'documents_paymentline' })
], PaymentLine);
//# sourceMappingURL=payment-line.entity.js.map