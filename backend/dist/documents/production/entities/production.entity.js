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
exports.Production = void 0;
const typeorm_1 = require("typeorm");
const entities_1 = require("../../../common/entities");
const entities_2 = require("../../../companies/entities");
const entities_3 = require("../../../warehouse/entities");
const entities_4 = require("../../../libs/entities");
const production_in_line_entity_1 = require("./production-in-line.entity");
const production_out_line_entity_1 = require("./production-out-line.entity");
let Production = class Production extends entities_1.AbstractEntity {
    constructor(entity) {
        super();
        Object.assign(this, { ...entity, createdById: 1 });
    }
};
exports.Production = Production;
__decorate([
    (0, typeorm_1.ManyToOne)(() => entities_2.Company, {
        onDelete: 'RESTRICT',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'company_id' }),
    __metadata("design:type", entities_2.Company)
], Production.prototype, "company", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'company_id' }),
    __metadata("design:type", Number)
], Production.prototype, "companyId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => entities_3.Warehouse, {
        onDelete: 'RESTRICT',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'warehouse_id' }),
    __metadata("design:type", entities_3.Warehouse)
], Production.prototype, "warehouse", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'warehouse_id' }),
    __metadata("design:type", Number)
], Production.prototype, "warehouseId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'expected_date',
        type: 'date',
        nullable: true,
    }),
    __metadata("design:type", Date)
], Production.prototype, "expectedDate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        default: false,
    }),
    __metadata("design:type", Boolean)
], Production.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        precision: 0,
        type: 'timestamp',
        nullable: false,
        default: () => 'CURRENT_TIMESTAMP',
        name: 'created_at',
    }),
    __metadata("design:type", Date)
], Production.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 200,
        nullable: true,
    }),
    __metadata("design:type", String)
], Production.prototype, "comment", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => entities_4.TechnicalProcess),
    (0, typeorm_1.JoinTable)({
        name: 'documents_production_technical_process',
        joinColumn: {
            name: 'production_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'technicalprocess_id',
            referencedColumnName: 'id',
        },
    }),
    __metadata("design:type", Array)
], Production.prototype, "technicalProcesses", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => production_in_line_entity_1.ProductionInLine, (productionInLine) => productionInLine.production, { cascade: true }),
    __metadata("design:type", Array)
], Production.prototype, "productionInLines", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => production_out_line_entity_1.ProductionOutLine, (productionOutLine) => productionOutLine.production, { cascade: true }),
    __metadata("design:type", Array)
], Production.prototype, "productionOutLines", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by_id' }),
    __metadata("design:type", Number)
], Production.prototype, "createdById", void 0);
exports.Production = Production = __decorate([
    (0, typeorm_1.Entity)({ name: 'documents_production' }),
    __metadata("design:paramtypes", [Object])
], Production);
//# sourceMappingURL=production.entity.js.map