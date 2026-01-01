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
exports.TransitLine = void 0;
const typeorm_1 = require("typeorm");
const entities_1 = require("../../../common/entities");
const entities_2 = require("../../shipment/entities");
const entities_3 = require("../../receive/entities");
const entities_4 = require("../../../libs/entities");
const entities_5 = require("../../../goods/entities");
let TransitLine = class TransitLine extends entities_1.AbstractEntity {
    constructor(entity) {
        super();
        Object.assign(this, entity);
    }
};
exports.TransitLine = TransitLine;
__decorate([
    (0, typeorm_1.ManyToOne)(() => entities_2.Shipment, {
        onDelete: 'RESTRICT',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'shipment_id' }),
    __metadata("design:type", entities_2.Shipment)
], TransitLine.prototype, "shipment", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'shipment_id' }),
    __metadata("design:type", Number)
], TransitLine.prototype, "shipmentId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => entities_5.Batch, {
        onDelete: 'RESTRICT',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'batch_id' }),
    __metadata("design:type", entities_5.Batch)
], TransitLine.prototype, "batch", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'batch_id' }),
    __metadata("design:type", Number)
], TransitLine.prototype, "batchId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => entities_5.Package, {
        onDelete: 'RESTRICT',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'package_id' }),
    __metadata("design:type", entities_5.Package)
], TransitLine.prototype, "package", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'package_id' }),
    __metadata("design:type", Number)
], TransitLine.prototype, "packageId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'int',
    }),
    __metadata("design:type", Number)
], TransitLine.prototype, "qty", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => entities_3.Receive, {
        onDelete: 'RESTRICT',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'receive_id' }),
    __metadata("design:type", entities_3.Receive)
], TransitLine.prototype, "receive", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'receive_id' }),
    __metadata("design:type", Number)
], TransitLine.prototype, "receiveId", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => entities_4.TechnicalProcess),
    (0, typeorm_1.JoinTable)({
        name: 'documents_transitline_technical_process',
        joinColumn: {
            name: 'transitline_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'technicalprocess_id',
            referencedColumnName: 'id',
        },
    }),
    __metadata("design:type", Array)
], TransitLine.prototype, "technicalProcesses", void 0);
exports.TransitLine = TransitLine = __decorate([
    (0, typeorm_1.Entity)({ name: 'documents_transitline' }),
    __metadata("design:paramtypes", [Object])
], TransitLine);
//# sourceMappingURL=transit-line.entity.js.map