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
exports.Shipment = void 0;
const typeorm_1 = require("typeorm");
const transformers_1 = require("../../../common/transformers");
const entities_1 = require("../../entities");
const entities_2 = require("../../../libs/entities");
const entities_3 = require("../../../warehouse/entities");
const entities_4 = require("../../invoice/entities");
const shipment_line_entity_1 = require("./shipment-line.entity");
const shipment_service_line_entity_1 = require("./shipment-service-line.entity");
const entities_5 = require("../../receive/entities");
let Shipment = class Shipment extends entities_1.AbstractDocumentEntity {
};
exports.Shipment = Shipment;
__decorate([
    (0, typeorm_1.ManyToOne)(() => entities_2.Incoterms, {
        onDelete: 'RESTRICT',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'incoterms_id' }),
    __metadata("design:type", entities_2.Incoterms)
], Shipment.prototype, "incoterms", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'incoterms_id' }),
    __metadata("design:type", Number)
], Shipment.prototype, "incotermsId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'transport_place',
        type: 'varchar',
        length: 20,
    }),
    __metadata("design:type", String)
], Shipment.prototype, "transportPlace", void 0);
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
], Shipment.prototype, "transportAmount", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => entities_3.Warehouse, {
        onDelete: 'RESTRICT',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'seller_warehouse_id' }),
    __metadata("design:type", entities_3.Warehouse)
], Shipment.prototype, "sellerWarehouse", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'seller_warehouse_id' }),
    __metadata("design:type", Number)
], Shipment.prototype, "sellerWarehouseId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'expected_date',
        type: 'date',
        nullable: true,
    }),
    __metadata("design:type", Date)
], Shipment.prototype, "expectedDate", void 0);
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
], Shipment.prototype, "documentSum", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => entities_4.Invoice, {
        onDelete: 'RESTRICT',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'invoice_id' }),
    __metadata("design:type", entities_4.Invoice)
], Shipment.prototype, "invoice", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'invoice_id' }),
    __metadata("design:type", Number)
], Shipment.prototype, "invoiceId", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => entities_2.TechnicalProcess),
    (0, typeorm_1.JoinTable)({
        name: 'documents_shipment_technical_process',
        joinColumn: {
            name: 'shipment_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'technicalprocess_id',
            referencedColumnName: 'id',
        },
    }),
    __metadata("design:type", Array)
], Shipment.prototype, "technicalProcesses", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => shipment_line_entity_1.ShipmentLine, (shipmentLine) => shipmentLine.shipment, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], Shipment.prototype, "shipmentLines", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => shipment_service_line_entity_1.ShipmentServiceLine, (shipmentServiceLine) => shipmentServiceLine.shipment, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], Shipment.prototype, "shipmentServiceLines", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => entities_5.Receive, (receive) => receive.shipment),
    __metadata("design:type", Array)
], Shipment.prototype, "receives", void 0);
exports.Shipment = Shipment = __decorate([
    (0, typeorm_1.Entity)({ name: 'documents_shipment' })
], Shipment);
//# sourceMappingURL=shipment.entity.js.map