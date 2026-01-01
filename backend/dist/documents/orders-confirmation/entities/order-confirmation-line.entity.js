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
exports.OrderConfirmationLine = void 0;
const typeorm_1 = require("typeorm");
const entities_1 = require("../../entities");
const order_confirmation_entity_1 = require("./order-confirmation.entity");
const entities_2 = require("../../../goods/entities");
let OrderConfirmationLine = class OrderConfirmationLine extends entities_1.AbstractLineEntity {
};
exports.OrderConfirmationLine = OrderConfirmationLine;
__decorate([
    (0, typeorm_1.ManyToOne)(() => order_confirmation_entity_1.OrderConfirmation, {
        onDelete: 'RESTRICT',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'order_confirmation_id' }),
    __metadata("design:type", order_confirmation_entity_1.OrderConfirmation)
], OrderConfirmationLine.prototype, "orderConfirmation", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => entities_2.Product, {
        onDelete: 'RESTRICT',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'product_man_id' }),
    __metadata("design:type", entities_2.Product)
], OrderConfirmationLine.prototype, "productMan", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => entities_2.Product, {
        onDelete: 'RESTRICT',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'product_buy_id' }),
    __metadata("design:type", entities_2.Product)
], OrderConfirmationLine.prototype, "productBuy", void 0);
exports.OrderConfirmationLine = OrderConfirmationLine = __decorate([
    (0, typeorm_1.Entity)({ name: 'documents_confirmationorderline' })
], OrderConfirmationLine);
//# sourceMappingURL=order-confirmation-line.entity.js.map