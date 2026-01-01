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
exports.ReceiveServiceLine = void 0;
const typeorm_1 = require("typeorm");
const entities_1 = require("../../entities");
const entities_2 = require("../../../goods/entities");
const receive_entity_1 = require("./receive.entity");
let ReceiveServiceLine = class ReceiveServiceLine extends entities_1.AbstractServiceLineEntity {
};
exports.ReceiveServiceLine = ReceiveServiceLine;
__decorate([
    (0, typeorm_1.ManyToOne)(() => receive_entity_1.Receive, {
        onDelete: 'RESTRICT',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'receive_id' }),
    __metadata("design:type", receive_entity_1.Receive)
], ReceiveServiceLine.prototype, "receive", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => entities_2.Service, {
        onDelete: 'RESTRICT',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'service_id' }),
    __metadata("design:type", entities_2.Service)
], ReceiveServiceLine.prototype, "service", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'service_id' }),
    __metadata("design:type", Number)
], ReceiveServiceLine.prototype, "serviceId", void 0);
exports.ReceiveServiceLine = ReceiveServiceLine = __decorate([
    (0, typeorm_1.Entity)({ name: 'documents_receiveserviceline' })
], ReceiveServiceLine);
//# sourceMappingURL=receive-service-line.entity.js.map