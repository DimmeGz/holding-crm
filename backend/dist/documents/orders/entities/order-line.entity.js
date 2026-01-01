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
exports.OrderLine = void 0;
const typeorm_1 = require("typeorm");
const entities_1 = require("../../entities");
const order_entity_1 = require("./order.entity");
const entities_2 = require("../../../goods/entities");
let OrderLine = class OrderLine extends entities_1.AbstractLineEntity {
};
exports.OrderLine = OrderLine;
__decorate([
    (0, typeorm_1.ManyToOne)(() => order_entity_1.Order, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'order_id' }),
    __metadata("design:type", order_entity_1.Order)
], OrderLine.prototype, "order", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => entities_2.Product, {
        onDelete: 'RESTRICT',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'product_man_id' }),
    __metadata("design:type", entities_2.Product)
], OrderLine.prototype, "productMan", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_man_id' }),
    __metadata("design:type", Number)
], OrderLine.prototype, "productManId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => entities_2.Product, {
        onDelete: 'RESTRICT',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'product_buy_id' }),
    __metadata("design:type", entities_2.Product)
], OrderLine.prototype, "productBuy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_buy_id' }),
    __metadata("design:type", Number)
], OrderLine.prototype, "productBuyId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'batch_rename',
        type: 'varchar',
        length: 10,
    }),
    __metadata("design:type", String)
], OrderLine.prototype, "batchRename", void 0);
exports.OrderLine = OrderLine = __decorate([
    (0, typeorm_1.Entity)({ name: 'documents_orderline' })
], OrderLine);
//# sourceMappingURL=order-line.entity.js.map