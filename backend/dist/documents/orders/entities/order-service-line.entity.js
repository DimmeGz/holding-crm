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
exports.OrderServiceLine = void 0;
const typeorm_1 = require("typeorm");
const entities_1 = require("../../entities");
const order_entity_1 = require("./order.entity");
const entities_2 = require("../../../goods/entities");
let OrderServiceLine = class OrderServiceLine extends entities_1.AbstractServiceLineEntity {
};
exports.OrderServiceLine = OrderServiceLine;
__decorate([
    (0, typeorm_1.ManyToOne)(() => order_entity_1.Order, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'order_id' }),
    __metadata("design:type", order_entity_1.Order)
], OrderServiceLine.prototype, "order", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => entities_2.Service, {
        onDelete: 'RESTRICT',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'service_id' }),
    __metadata("design:type", entities_2.Service)
], OrderServiceLine.prototype, "service", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'service_id' }),
    __metadata("design:type", Number)
], OrderServiceLine.prototype, "serviceId", void 0);
exports.OrderServiceLine = OrderServiceLine = __decorate([
    (0, typeorm_1.Entity)({ name: 'documents_orderserviceline' })
], OrderServiceLine);
//# sourceMappingURL=order-service-line.entity.js.map