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
exports.Company = void 0;
const typeorm_1 = require("typeorm");
const enums_1 = require("../enums");
const entities_1 = require("../../common/entities");
const account_entity_1 = require("./account.entity");
const entities_2 = require("../../warehouse/entities");
const entities_3 = require("../../documents/production/entities");
const entities_4 = require("../../documents/invoice/entities");
let Company = class Company extends entities_1.AbstractEntity {
};
exports.Company = Company;
__decorate([
    (0, typeorm_1.Column)({ name: 'name', type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], Company.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'full_name', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], Company.prototype, "fullName", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'name_for_print',
        type: 'varchar',
        length: 50,
        nullable: true,
    }),
    __metadata("design:type", String)
], Company.prototype, "printName", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'name_for_print_2',
        type: 'varchar',
        length: 50,
        nullable: true,
    }),
    __metadata("design:type", String)
], Company.prototype, "printName2", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'report_type', default: 0, type: 'smallint', unsigned: true }),
    __metadata("design:type", Number)
], Company.prototype, "reportType", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => entities_2.Warehouse, {
        onDelete: 'RESTRICT',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'default_warehouse_id' }),
    __metadata("design:type", entities_2.Warehouse)
], Company.prototype, "defaultWarehouse", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'default_warehouse_id' }),
    __metadata("design:type", Number)
], Company.prototype, "defaultWarehouseId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'invoice_prefix',
        type: 'varchar',
        length: 6,
        nullable: true,
    }),
    __metadata("design:type", String)
], Company.prototype, "invoicePrefix", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'invoice_prefix_alternative',
        type: 'varchar',
        length: 6,
        nullable: true,
    }),
    __metadata("design:type", String)
], Company.prototype, "invoicePrefixAlternative", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'payment_delay',
        default: 0,
        type: 'smallint',
        unsigned: true,
    }),
    __metadata("design:type", Number)
], Company.prototype, "paymentDelay", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'company_type',
        type: 'enum',
        enum: enums_1.CompanyType,
    }),
    __metadata("design:type", String)
], Company.prototype, "companyType", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        nullable: true,
    }),
    __metadata("design:type", String)
], Company.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'smallint',
        unsigned: true,
        nullable: true,
    }),
    __metadata("design:type", Number)
], Company.prototype, "tin", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        nullable: true,
    }),
    __metadata("design:type", String)
], Company.prototype, "contacts", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'bank_name',
        type: 'varchar',
        length: 50,
        nullable: true,
    }),
    __metadata("design:type", String)
], Company.prototype, "bankName", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'bank_info',
        type: 'varchar',
        nullable: true,
    }),
    __metadata("design:type", String)
], Company.prototype, "bankInfo", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'default_ponz',
        type: 'smallint',
        unsigned: true,
        nullable: true,
    }),
    __metadata("design:type", Number)
], Company.prototype, "defaultPonz", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'contact_person',
        type: 'varchar',
        length: 30,
        nullable: true,
    }),
    __metadata("design:type", String)
], Company.prototype, "contactPerson", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => entities_2.Warehouse),
    (0, typeorm_1.JoinTable)({
        name: 'companies_company_warehouses_usage',
        joinColumn: {
            name: 'company_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'warehouse_id',
            referencedColumnName: 'id',
        },
    }),
    __metadata("design:type", Array)
], Company.prototype, "warehousesUsage", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'vat_triangulation_basis',
        type: 'varchar',
        length: 50,
        nullable: true,
    }),
    __metadata("design:type", String)
], Company.prototype, "vatTriangulationBasis", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'calendar_hex',
        type: 'varchar',
        length: 9,
        nullable: true,
    }),
    __metadata("design:type", String)
], Company.prototype, "calendarHex", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => account_entity_1.Account, (account) => account.company),
    __metadata("design:type", Array)
], Company.prototype, "accounts", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => entities_3.Production, (production) => production.company),
    __metadata("design:type", Array)
], Company.prototype, "productions", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => entities_4.Invoice, (invoice) => invoice.buyer),
    __metadata("design:type", Array)
], Company.prototype, "incomeInvoices", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => entities_4.Invoice, (invoice) => invoice.seller),
    __metadata("design:type", Array)
], Company.prototype, "outcomeInvoices", void 0);
exports.Company = Company = __decorate([
    (0, typeorm_1.Entity)({ name: 'companies_company' })
], Company);
//# sourceMappingURL=company.entity.js.map