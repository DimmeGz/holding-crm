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
exports.ShipmentServiceLine = void 0;
const typeorm_1 = require("typeorm");
const entities_1 = require("../../entities");
const entities_2 = require("../../../goods/entities");
const shipment_entity_1 = require("./shipment.entity");
let ShipmentServiceLine = class ShipmentServiceLine extends entities_1.AbstractServiceLineEntity {
};
exports.ShipmentServiceLine = ShipmentServiceLine;
__decorate([
    (0, typeorm_1.ManyToOne)(() => shipment_entity_1.Shipment, {
        onDelete: 'RESTRICT',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'shipment_id' }),
    __metadata("design:type", shipment_entity_1.Shipment)
], ShipmentServiceLine.prototype, "shipment", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => entities_2.Service, {
        onDelete: 'RESTRICT',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'service_id' }),
    __metadata("design:type", entities_2.Service)
], ShipmentServiceLine.prototype, "service", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'service_id' }),
    __metadata("design:type", Number)
], ShipmentServiceLine.prototype, "serviceId", void 0);
exports.ShipmentServiceLine = ShipmentServiceLine = __decorate([
    (0, typeorm_1.Entity)({ name: 'documents_shipmentserviceline' })
], ShipmentServiceLine);
//# sourceMappingURL=shipment-service-line.entity.js.map