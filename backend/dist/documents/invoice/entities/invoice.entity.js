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
exports.Invoice = void 0;
const typeorm_1 = require("typeorm");
const transformers_1 = require("../../../common/transformers");
const entities_1 = require("../../entities");
const entities_2 = require("../../../libs/entities");
const invoice_line_entity_1 = require("./invoice-line.entity");
const invoice_service_line_entity_1 = require("./invoice-service-line.entity");
const entities_3 = require("../../commission-invoice/entities");
const entities_4 = require("../../shipment/entities");
const entities_5 = require("../../payment/entities");
let Invoice = class Invoice extends entities_1.AbstractDocumentRecipientEntity {
};
exports.Invoice = Invoice;
__decorate([
    (0, typeorm_1.Column)({
        name: 'payment_delay',
        type: 'smallint',
        default: 0,
    }),
    __metadata("design:type", Number)
], Invoice.prototype, "paymentDelay", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => entities_2.Currency, {
        onDelete: 'RESTRICT',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'currency_id' }),
    __metadata("design:type", entities_2.Currency)
], Invoice.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({
        default: false,
    }),
    __metadata("design:type", Boolean)
], Invoice.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        unsigned: true,
        precision: 5,
        scale: 2,
        default: 0,
        transformer: new transformers_1.DecimalColumnTransformer(),
    }),
    __metadata("design:type", Number)
], Invoice.prototype, "vat", void 0);
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
], Invoice.prototype, "documentSum", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'payment_balance',
        type: 'decimal',
        unsigned: true,
        precision: 10,
        scale: 3,
        default: 0,
        transformer: new transformers_1.DecimalColumnTransformer(),
    }),
    __metadata("design:type", Number)
], Invoice.prototype, "paymentBalance", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'car_plate',
        type: 'varchar',
        length: 30,
        nullable: true,
    }),
    __metadata("design:type", String)
], Invoice.prototype, "carPlate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'number',
        type: 'varchar',
        length: 15,
        unique: true,
    }),
    __metadata("design:type", String)
], Invoice.prototype, "invoiceNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'expected_date',
        type: 'date',
        nullable: true,
    }),
    __metadata("design:type", Date)
], Invoice.prototype, "expectedDate", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Invoice, {
        nullable: true,
        onDelete: 'RESTRICT',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'parent_id' }),
    __metadata("design:type", Invoice)
], Invoice.prototype, "parent", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'parent_id' }),
    __metadata("design:type", Number)
], Invoice.prototype, "parentId", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Invoice, (invoice) => invoice.parent),
    __metadata("design:type", Array)
], Invoice.prototype, "children", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'separation',
        default: false,
    }),
    __metadata("design:type", Boolean)
], Invoice.prototype, "separation", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'report_period',
        type: 'date',
        nullable: true,
    }),
    __metadata("design:type", Date)
], Invoice.prototype, "reportPeriod", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'smallint',
        nullable: true,
    }),
    __metadata("design:type", Number)
], Invoice.prototype, "ponz", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'gross_weight',
        type: 'smallint',
        unsigned: true,
        nullable: true,
    }),
    __metadata("design:type", Number)
], Invoice.prototype, "grossWeight", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => entities_2.Incoterms, {
        onDelete: 'RESTRICT',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'incoterms_id' }),
    __metadata("design:type", entities_2.Incoterms)
], Invoice.prototype, "incoterms", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'incoterms_id' }),
    __metadata("design:type", Number)
], Invoice.prototype, "incotermsId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'transport_place',
        type: 'varchar',
        length: 20,
    }),
    __metadata("design:type", String)
], Invoice.prototype, "transportPlace", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'transport_amount',
        type: 'decimal',
        unsigned: true,
        precision: 8,
        scale: 2,
        default: 0,
        transformer: new transformers_1.DecimalColumnTransformer(),
    }),
    __metadata("design:type", Number)
], Invoice.prototype, "transportAmount", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => entities_2.TechnicalProcess),
    (0, typeorm_1.JoinTable)({
        name: 'documents_invoice_technical_process',
        joinColumn: {
            name: 'invoice_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'technicalprocess_id',
            referencedColumnName: 'id',
        },
    }),
    __metadata("design:type", Array)
], Invoice.prototype, "technicalProcesses", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'contract_info',
        type: 'varchar',
        length: 200,
    }),
    __metadata("design:type", String)
], Invoice.prototype, "contractInfo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'report_duplicating', default: false }),
    __metadata("design:type", Boolean)
], Invoice.prototype, "reportDuplicating", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => invoice_line_entity_1.InvoiceLine, (invoiceLine) => invoiceLine.invoice, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], Invoice.prototype, "invoiceLines", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => invoice_service_line_entity_1.InvoiceServiceLine, (invoiceServiceLine) => invoiceServiceLine.invoice, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], Invoice.prototype, "invoiceServiceLines", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => entities_4.Shipment, (shipment) => shipment.invoice, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], Invoice.prototype, "shipments", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => entities_3.CommissionInvoice, (commissionInvoice) => commissionInvoice.invoice, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], Invoice.prototype, "commissionInvoices", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => entities_5.PaymentLine, (paymentLine) => paymentLine.invoice, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], Invoice.prototype, "paymentLines", void 0);
exports.Invoice = Invoice = __decorate([
    (0, typeorm_1.Entity)({ name: 'documents_invoice' })
], Invoice);
//# sourceMappingURL=invoice.entity.js.map