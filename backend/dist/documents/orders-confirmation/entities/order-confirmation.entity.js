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
exports.OrderConfirmation = void 0;
const typeorm_1 = require("typeorm");
const entities_1 = require("../../../libs/entities");
const entities_2 = require("../../orders/entities");
const entities_3 = require("../../../warehouse/entities");
const entities_4 = require("../../../companies/entities");
const entities_5 = require("../../../common/entities");
let OrderConfirmation = class OrderConfirmation extends entities_5.AbstractEntity {
    constructor(entity) {
        super();
        Object.assign(this, { ...entity, createdById: 1 });
    }
};
exports.OrderConfirmation = OrderConfirmation;
__decorate([
    (0, typeorm_1.ManyToOne)(() => entities_4.Company, {
        onDelete: 'RESTRICT',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'seller_id' }),
    __metadata("design:type", entities_4.Company)
], OrderConfirmation.prototype, "seller", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'seller_id' }),
    __metadata("design:type", Number)
], OrderConfirmation.prototype, "sellerId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => entities_4.Company, {
        onDelete: 'RESTRICT',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'buyer_id' }),
    __metadata("design:type", entities_4.Company)
], OrderConfirmation.prototype, "buyer", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'buyer_id' }),
    __metadata("design:type", Number)
], OrderConfirmation.prototype, "buyerId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => entities_1.Currency, {
        onDelete: 'RESTRICT',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'currency_id' }),
    __metadata("design:type", entities_1.Currency)
], OrderConfirmation.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'currency_id' }),
    __metadata("design:type", Number)
], OrderConfirmation.prototype, "currencyId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 200,
        nullable: true,
    }),
    __metadata("design:type", String)
], OrderConfirmation.prototype, "comment", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        precision: 0,
        type: 'timestamp',
        nullable: false,
        default: () => 'CURRENT_TIMESTAMP',
        name: 'created_at',
    }),
    __metadata("design:type", Date)
], OrderConfirmation.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => entities_3.Warehouse, {
        onDelete: 'RESTRICT',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'seller_warehouse_id' }),
    __metadata("design:type", entities_3.Warehouse)
], OrderConfirmation.prototype, "sellerWarehouse", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'seller_warehouse_id' }),
    __metadata("design:type", Number)
], OrderConfirmation.prototype, "sellerWarehouseId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => entities_3.Warehouse, {
        onDelete: 'RESTRICT',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'buyer_warehouse_id' }),
    __metadata("design:type", entities_3.Warehouse)
], OrderConfirmation.prototype, "buyerWarehouse", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'buyer_warehouse_id' }),
    __metadata("design:type", Number)
], OrderConfirmation.prototype, "buyerWarehouseId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => entities_4.Company, {
        onDelete: 'RESTRICT',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'recipient_id' }),
    __metadata("design:type", entities_4.Company)
], OrderConfirmation.prototype, "recipient", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'recipient_id' }),
    __metadata("design:type", Number)
], OrderConfirmation.prototype, "recipientId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => entities_3.Warehouse, {
        onDelete: 'RESTRICT',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'recipient_warehouse_id' }),
    __metadata("design:type", entities_3.Warehouse)
], OrderConfirmation.prototype, "recipientWarehouse", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'recipient_warehouse_id' }),
    __metadata("design:type", Number)
], OrderConfirmation.prototype, "recipientWarehouseId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'payment_delay',
        type: 'smallint',
        default: 0,
    }),
    __metadata("design:type", Number)
], OrderConfirmation.prototype, "paymentDelay", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => entities_2.Order, {
        onDelete: 'RESTRICT',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'order_id' }),
    __metadata("design:type", entities_2.Order)
], OrderConfirmation.prototype, "order", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'order_id' }),
    __metadata("design:type", Number)
], OrderConfirmation.prototype, "orderId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'number',
        type: 'varchar',
        length: 15,
        unique: true,
    }),
    __metadata("design:type", String)
], OrderConfirmation.prototype, "confirmationNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'expected_date',
        type: 'date',
        nullable: true,
    }),
    __metadata("design:type", Date)
], OrderConfirmation.prototype, "expectedDate", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => entities_1.Incoterms, {
        onDelete: 'RESTRICT',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'incoterms_id' }),
    __metadata("design:type", entities_1.Incoterms)
], OrderConfirmation.prototype, "incoterms", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'incoterms_id' }),
    __metadata("design:type", Number)
], OrderConfirmation.prototype, "incotermsId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'transport_place',
        type: 'varchar',
        length: 20,
    }),
    __metadata("design:type", String)
], OrderConfirmation.prototype, "transportPlace", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => entities_1.TechnicalProcess),
    (0, typeorm_1.JoinTable)({
        name: 'documents_orderconfirmation_technical_process',
        joinColumn: {
            name: 'orderconfirmation_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'technicalprocess_id',
            referencedColumnName: 'id',
        },
    }),
    __metadata("design:type", Array)
], OrderConfirmation.prototype, "technicalProcesses", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by_id' }),
    __metadata("design:type", Number)
], OrderConfirmation.prototype, "createdById", void 0);
exports.OrderConfirmation = OrderConfirmation = __decorate([
    (0, typeorm_1.Entity)({ name: 'documents_orderconfirmation' }),
    __metadata("design:paramtypes", [Object])
], OrderConfirmation);
//# sourceMappingURL=order-confirmation.entity.js.map