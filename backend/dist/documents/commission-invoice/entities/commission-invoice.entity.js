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
exports.CommissionInvoice = void 0;
const typeorm_1 = require("typeorm");
const transformers_1 = require("../../../common/transformers");
const entities_1 = require("../../entities");
const entities_2 = require("../../invoice/entities");
const entities_3 = require("../../../libs/entities");
const entities_4 = require("../../commission-payment/entities");
let CommissionInvoice = class CommissionInvoice extends entities_1.AbstractDocumentEntity {
};
exports.CommissionInvoice = CommissionInvoice;
__decorate([
    (0, typeorm_1.Column)({
        name: 'document_sum',
        type: 'decimal',
        unsigned: true,
        precision: 13,
        scale: 3,
        default: 0,
        transformer: new transformers_1.DecimalColumnTransformer(),
    }),
    __metadata("design:type", Number)
], CommissionInvoice.prototype, "documentSum", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'payment_balance',
        type: 'decimal',
        unsigned: true,
        precision: 10,
        scale: 2,
        default: 0,
        transformer: new transformers_1.DecimalColumnTransformer(),
    }),
    __metadata("design:type", Number)
], CommissionInvoice.prototype, "paymentBalance", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'creation_date',
        type: 'date',
        default: Date.now(),
    }),
    __metadata("design:type", Date)
], CommissionInvoice.prototype, "creationDate", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => entities_2.Invoice, {
        onDelete: 'RESTRICT',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'invoice_id' }),
    __metadata("design:type", entities_2.Invoice)
], CommissionInvoice.prototype, "invoice", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'invoice_id' }),
    __metadata("design:type", Number)
], CommissionInvoice.prototype, "invoiceId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        unsigned: true,
        precision: 5,
        scale: 2,
        transformer: new transformers_1.DecimalColumnTransformer(),
    }),
    __metadata("design:type", Number)
], CommissionInvoice.prototype, "rate", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => entities_3.TechnicalProcess),
    (0, typeorm_1.JoinTable)({
        name: 'documents_commissioninvoice_technical_process',
        joinColumn: {
            name: 'commissioninvoice_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'technicalprocess_id',
            referencedColumnName: 'id',
        },
    }),
    __metadata("design:type", Array)
], CommissionInvoice.prototype, "technicalProcesses", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => entities_4.CommissionPayment, (commissionPayment) => commissionPayment.commissionInvoice, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], CommissionInvoice.prototype, "commissionPayments", void 0);
exports.CommissionInvoice = CommissionInvoice = __decorate([
    (0, typeorm_1.Entity)({ name: 'documents_commissioninvoice' })
], CommissionInvoice);
//# sourceMappingURL=commission-invoice.entity.js.map