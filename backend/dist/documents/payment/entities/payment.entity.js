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
exports.Payment = void 0;
const typeorm_1 = require("typeorm");
const transformers_1 = require("../../../common/transformers");
const entities_1 = require("../../entities");
const entities_2 = require("../../../libs/entities");
const payment_line_entity_1 = require("./payment-line.entity");
let Payment = class Payment extends entities_1.AbstractDocumentEntity {
};
exports.Payment = Payment;
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
], Payment.prototype, "documentSum", void 0);
__decorate([
    (0, typeorm_1.Column)({
        default: false,
    }),
    __metadata("design:type", Boolean)
], Payment.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'expected_date',
        type: 'date',
        nullable: true,
    }),
    __metadata("design:type", Date)
], Payment.prototype, "expectedDate", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => entities_2.TechnicalProcess),
    (0, typeorm_1.JoinTable)({
        name: 'documents_payment_technical_process',
        joinColumn: {
            name: 'payment_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'technicalprocess_id',
            referencedColumnName: 'id',
        },
    }),
    __metadata("design:type", Array)
], Payment.prototype, "technicalProcesses", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => payment_line_entity_1.PaymentLine, (paymentLine) => paymentLine.payment, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], Payment.prototype, "paymentLines", void 0);
exports.Payment = Payment = __decorate([
    (0, typeorm_1.Entity)({ name: 'documents_payment' })
], Payment);
//# sourceMappingURL=payment.entity.js.map