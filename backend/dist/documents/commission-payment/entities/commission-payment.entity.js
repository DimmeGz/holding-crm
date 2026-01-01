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
exports.CommissionPayment = void 0;
const typeorm_1 = require("typeorm");
const transformers_1 = require("../../../common/transformers");
const entities_1 = require("../../entities");
const entities_2 = require("../../commission-invoice/entities");
const entities_3 = require("../../../libs/entities");
let CommissionPayment = class CommissionPayment extends entities_1.AbstractDocumentEntity {
};
exports.CommissionPayment = CommissionPayment;
__decorate([
    (0, typeorm_1.ManyToOne)(() => entities_2.CommissionInvoice, {
        onDelete: 'RESTRICT',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'commission_invoice_id' }),
    __metadata("design:type", entities_2.CommissionInvoice)
], CommissionPayment.prototype, "commissionInvoice", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'commission_invoice_id' }),
    __metadata("design:type", Number)
], CommissionPayment.prototype, "commissionInvoiceId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'expected_date',
        type: 'date',
        nullable: true,
    }),
    __metadata("design:type", Date)
], CommissionPayment.prototype, "expectedDate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        unsigned: true,
        precision: 8,
        scale: 2,
        transformer: new transformers_1.DecimalColumnTransformer(),
    }),
    __metadata("design:type", Number)
], CommissionPayment.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => entities_3.TechnicalProcess),
    (0, typeorm_1.JoinTable)({
        name: 'documents_commissionpayment_technical_process',
        joinColumn: {
            name: 'commissionpayment_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'technicalprocess_id',
            referencedColumnName: 'id',
        },
    }),
    __metadata("design:type", Array)
], CommissionPayment.prototype, "technicalProcesses", void 0);
exports.CommissionPayment = CommissionPayment = __decorate([
    (0, typeorm_1.Entity)({ name: 'documents_commissionpayment' })
], CommissionPayment);
//# sourceMappingURL=commission-payment.entity.js.map