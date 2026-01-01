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
exports.Receive = void 0;
const typeorm_1 = require("typeorm");
const transformers_1 = require("../../../common/transformers");
const entities_1 = require("../../entities");
const entities_2 = require("../../../libs/entities");
const entities_3 = require("../../../warehouse/entities");
const receive_line_entity_1 = require("./receive-line.entity");
const entities_4 = require("../../shipment/entities");
const receive_service_line_entity_1 = require("./receive-service-line.entity");
let Receive = class Receive extends entities_1.AbstractDocumentEntity {
};
exports.Receive = Receive;
__decorate([
    (0, typeorm_1.ManyToOne)(() => entities_2.Incoterms, {
        onDelete: 'RESTRICT',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'incoterms_id' }),
    __metadata("design:type", entities_2.Incoterms)
], Receive.prototype, "incoterms", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'incoterms_id' }),
    __metadata("design:type", Number)
], Receive.prototype, "incotermsId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'transport_place',
        type: 'varchar',
        length: 20,
    }),
    __metadata("design:type", String)
], Receive.prototype, "transportPlace", void 0);
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
], Receive.prototype, "transportAmount", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => entities_3.Warehouse, {
        onDelete: 'RESTRICT',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'buyer_warehouse_id' }),
    __metadata("design:type", entities_3.Warehouse)
], Receive.prototype, "buyerWarehouse", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'buyer_warehouse_id' }),
    __metadata("design:type", Number)
], Receive.prototype, "buyerWarehouseId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'expected_date',
        type: 'date',
        nullable: true,
    }),
    __metadata("design:type", Date)
], Receive.prototype, "expectedDate", void 0);
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
], Receive.prototype, "documentSum", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => entities_4.Shipment, {
        onDelete: 'RESTRICT',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'shipment_id' }),
    __metadata("design:type", entities_4.Shipment)
], Receive.prototype, "shipment", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'shipment_id' }),
    __metadata("design:type", Number)
], Receive.prototype, "shipmentId", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => entities_2.TechnicalProcess),
    (0, typeorm_1.JoinTable)({
        name: 'documents_receive_technical_process',
        joinColumn: {
            name: 'receive_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'technicalprocess_id',
            referencedColumnName: 'id',
        },
    }),
    __metadata("design:type", Array)
], Receive.prototype, "technicalProcesses", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => receive_line_entity_1.ReceiveLine, (receiveLine) => receiveLine.receive, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], Receive.prototype, "receiveLines", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => receive_service_line_entity_1.ReceiveServiceLine, (receiveServiceLine) => receiveServiceLine.receive, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], Receive.prototype, "receiveServiceLines", void 0);
exports.Receive = Receive = __decorate([
    (0, typeorm_1.Entity)({ name: 'documents_receive' })
], Receive);
//# sourceMappingURL=receive.entity.js.map