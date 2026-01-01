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
exports.ProductTransport = void 0;
const typeorm_1 = require("typeorm");
const entities_1 = require("../../../common/entities");
const entities_2 = require("../../../companies/entities");
const entities_3 = require("../../../warehouse/entities");
const entities_4 = require("../../../libs/entities");
const product_transport_line_entity_1 = require("./product-transport-line.entity");
const product_transport_service_line_entity_1 = require("./product-transport-service-line.entity");
let ProductTransport = class ProductTransport extends entities_1.AbstractEntity {
    constructor(entity) {
        super();
        Object.assign(this, { ...entity, createdById: 1 });
    }
};
exports.ProductTransport = ProductTransport;
__decorate([
    (0, typeorm_1.ManyToOne)(() => entities_2.Company, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'company_id' }),
    __metadata("design:type", entities_2.Company)
], ProductTransport.prototype, "company", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'company_id' }),
    __metadata("design:type", Number)
], ProductTransport.prototype, "companyId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => entities_3.Warehouse, {
        onDelete: 'RESTRICT',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'warehouse_sender_id' }),
    __metadata("design:type", entities_3.Warehouse)
], ProductTransport.prototype, "warehouseSender", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'warehouse_sender_id' }),
    __metadata("design:type", Number)
], ProductTransport.prototype, "warehouseSenderId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => entities_3.Warehouse, {
        onDelete: 'RESTRICT',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'warehouse_receive_id' }),
    __metadata("design:type", entities_3.Warehouse)
], ProductTransport.prototype, "warehouseReceive", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'warehouse_receive_id' }),
    __metadata("design:type", Number)
], ProductTransport.prototype, "warehouseReceiveId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 200,
        nullable: true,
    }),
    __metadata("design:type", String)
], ProductTransport.prototype, "comment", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        precision: 0,
        type: 'timestamp',
        nullable: false,
        default: () => 'CURRENT_TIMESTAMP',
        name: 'created_at',
    }),
    __metadata("design:type", Date)
], ProductTransport.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'expected_date',
        type: 'date',
        nullable: true,
    }),
    __metadata("design:type", Date)
], ProductTransport.prototype, "expectedDate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        default: false,
    }),
    __metadata("design:type", Boolean)
], ProductTransport.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => entities_4.TechnicalProcess),
    (0, typeorm_1.JoinTable)({
        name: 'documents_producttransport_technical_process',
        joinColumn: {
            name: 'producttransport_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'technicalprocess_id',
            referencedColumnName: 'id',
        },
    }),
    __metadata("design:type", Array)
], ProductTransport.prototype, "technicalProcesses", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => product_transport_line_entity_1.ProductTransportLine, (productTransportLine) => productTransportLine.productTransport, { cascade: true }),
    __metadata("design:type", Array)
], ProductTransport.prototype, "productTransportLines", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => product_transport_service_line_entity_1.ProductTransportServiceLine, (productTransportServiceLine) => productTransportServiceLine.productTransport, { cascade: true }),
    __metadata("design:type", Array)
], ProductTransport.prototype, "productTransportServiceLines", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by_id' }),
    __metadata("design:type", Number)
], ProductTransport.prototype, "createdById", void 0);
exports.ProductTransport = ProductTransport = __decorate([
    (0, typeorm_1.Entity)({ name: 'documents_producttransport' }),
    __metadata("design:paramtypes", [Object])
], ProductTransport);
//# sourceMappingURL=product-transport.entity.js.map