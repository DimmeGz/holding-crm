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
exports.Contract = void 0;
const typeorm_1 = require("typeorm");
const transformers_1 = require("../../../common/transformers");
const entities_1 = require("../../entities");
const entities_2 = require("../../../libs/entities");
const contract_line_entity_1 = require("./contract-line.entity");
const contract_service_line_entity_1 = require("./contract-service-line.entity");
let Contract = class Contract extends entities_1.AbstractDocumentEntity {
};
exports.Contract = Contract;
__decorate([
    (0, typeorm_1.ManyToMany)(() => entities_2.TechnicalProcess),
    (0, typeorm_1.JoinTable)({
        name: 'documents_contract_technical_process',
        joinColumn: {
            name: 'contract_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'technicalprocess_id',
            referencedColumnName: 'id',
        },
    }),
    __metadata("design:type", Array)
], Contract.prototype, "technicalProcesses", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'payment_delay',
        type: 'smallint',
        default: 0,
    }),
    __metadata("design:type", Number)
], Contract.prototype, "paymentDelay", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'signature_date',
        type: 'date',
        default: Date.now(),
    }),
    __metadata("design:type", Date)
], Contract.prototype, "signatureDate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        unsigned: true,
        precision: 5,
        scale: 2,
        default: 0,
        transformer: new transformers_1.DecimalColumnTransformer(),
    }),
    __metadata("design:type", Number)
], Contract.prototype, "vat", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 32,
    }),
    __metadata("design:type", String)
], Contract.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'date',
        nullable: true,
    }),
    __metadata("design:type", Date)
], Contract.prototype, "term", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Contract, {
        nullable: true,
        onDelete: 'RESTRICT',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'parent_id' }),
    __metadata("design:type", Contract)
], Contract.prototype, "parent", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'parent_id' }),
    __metadata("design:type", Number)
], Contract.prototype, "parentId", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Contract, (contract) => contract.parent),
    __metadata("design:type", Array)
], Contract.prototype, "children", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => entities_2.Incoterms, {
        onDelete: 'RESTRICT',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'incoterms_id' }),
    __metadata("design:type", entities_2.Incoterms)
], Contract.prototype, "incoterms", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'incoterms_id' }),
    __metadata("design:type", Number)
], Contract.prototype, "incotermsId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'transport_place',
        type: 'varchar',
        length: 20,
        nullable: true,
    }),
    __metadata("design:type", String)
], Contract.prototype, "transportPlace", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'order_prefix',
        type: 'varchar',
        length: 6,
        nullable: true,
    }),
    __metadata("design:type", String)
], Contract.prototype, "orderPrefix", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_archived', default: false }),
    __metadata("design:type", Boolean)
], Contract.prototype, "isArchived", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => contract_line_entity_1.ContractLine, (contractLine) => contractLine.contract, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], Contract.prototype, "contractLines", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => contract_service_line_entity_1.ContractServiceLine, (contractServiceLine) => contractServiceLine.contract, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], Contract.prototype, "contractServiceLines", void 0);
exports.Contract = Contract = __decorate([
    (0, typeorm_1.Entity)({ name: 'documents_contract' })
], Contract);
//# sourceMappingURL=contract.entity.js.map