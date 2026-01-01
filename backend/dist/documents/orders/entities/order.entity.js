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
exports.Order = void 0;
const typeorm_1 = require("typeorm");
const transformers_1 = require("../../../common/transformers");
const entities_1 = require("../../entities");
const entities_2 = require("../../../libs/entities");
const entities_3 = require("../../contracts/entities");
const order_line_entity_1 = require("./order-line.entity");
const entities_4 = require("../../orders-confirmation/entities");
const order_service_line_entity_1 = require("./order-service-line.entity");
let Order = class Order extends entities_1.AbstractDocumentRecipientEntity {
};
exports.Order = Order;
__decorate([
    (0, typeorm_1.Column)({
        name: 'payment_delay',
        type: 'smallint',
        default: 0,
    }),
    __metadata("design:type", Number)
], Order.prototype, "paymentDelay", void 0);
__decorate([
    (0, typeorm_1.Column)({
        default: false,
    }),
    __metadata("design:type", Boolean)
], Order.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'signature_date',
        type: 'date',
        default: Date.now(),
    }),
    __metadata("design:type", Date)
], Order.prototype, "signatureDate", void 0);
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
], Order.prototype, "vat", void 0);
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
], Order.prototype, "documentSum", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'car_plate',
        type: 'varchar',
        length: 30,
        nullable: true,
    }),
    __metadata("design:type", String)
], Order.prototype, "carPlate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'number',
        type: 'varchar',
        length: 15,
        unique: true,
    }),
    __metadata("design:type", String)
], Order.prototype, "orderNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'expected_date',
        type: 'date',
        nullable: true,
    }),
    __metadata("design:type", Date)
], Order.prototype, "expectedDate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'confirm_expected_date',
        type: 'date',
        nullable: true,
    }),
    __metadata("design:type", Date)
], Order.prototype, "confirmExpectedDate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'sorting_date',
        type: 'date',
        nullable: true,
    }),
    __metadata("design:type", Date)
], Order.prototype, "sortingDate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'date_asap',
        default: false,
    }),
    __metadata("design:type", Boolean)
], Order.prototype, "isDateAsap", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => entities_3.Contract, {
        onDelete: 'RESTRICT',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'contract_id' }),
    __metadata("design:type", entities_3.Contract)
], Order.prototype, "contract", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'contract_id' }),
    __metadata("design:type", Number)
], Order.prototype, "contractId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => entities_2.Incoterms, {
        onDelete: 'RESTRICT',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'incoterms_id' }),
    __metadata("design:type", entities_2.Incoterms)
], Order.prototype, "incoterms", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'incoterms_id' }),
    __metadata("design:type", Number)
], Order.prototype, "incotermsId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'transport_place',
        type: 'varchar',
        length: 20,
    }),
    __metadata("design:type", String)
], Order.prototype, "transportPlace", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'hidden',
        default: false,
    }),
    __metadata("design:type", Boolean)
], Order.prototype, "isHidden", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => entities_2.TechnicalProcess),
    (0, typeorm_1.JoinTable)({
        name: 'documents_order_technical_process',
        joinColumn: {
            name: 'order_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'technicalprocess_id',
            referencedColumnName: 'id',
        },
    }),
    __metadata("design:type", Array)
], Order.prototype, "technicalProcesses", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => order_line_entity_1.OrderLine, (orderLine) => orderLine.order, { cascade: true }),
    __metadata("design:type", Array)
], Order.prototype, "orderLines", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => order_service_line_entity_1.OrderServiceLine, (orderServiceLine) => orderServiceLine.order, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], Order.prototype, "orderServiceLines", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => entities_4.OrderConfirmation, (orderConfirmation) => orderConfirmation.order, { cascade: true }),
    __metadata("design:type", Array)
], Order.prototype, "orderConfirmations", void 0);
exports.Order = Order = __decorate([
    (0, typeorm_1.Entity)({ name: 'documents_order' })
], Order);
//# sourceMappingURL=order.entity.js.map