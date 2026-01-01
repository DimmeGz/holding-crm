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
exports.TechnicalProcess = void 0;
const typeorm_1 = require("typeorm");
const entities_1 = require("../../common/entities");
const entities_2 = require("../../goods/entities");
const entities_3 = require("../../documents/invoice/entities");
let TechnicalProcess = class TechnicalProcess extends entities_1.AbstractEntity {
};
exports.TechnicalProcess = TechnicalProcess;
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 40,
        unique: true,
    }),
    __metadata("design:type", String)
], TechnicalProcess.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => entities_2.Product),
    (0, typeorm_1.JoinTable)({
        name: 'warehouse_technicalprocess_product',
        joinColumn: {
            name: 'technicalprocess_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'product_id',
            referencedColumnName: 'id',
        },
    }),
    __metadata("design:type", Array)
], TechnicalProcess.prototype, "products", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => entities_2.Service),
    (0, typeorm_1.JoinTable)({
        name: 'warehouse_technicalprocess_service',
        joinColumn: {
            name: 'technicalprocess_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'service_id',
            referencedColumnName: 'id',
        },
    }),
    __metadata("design:type", Array)
], TechnicalProcess.prototype, "services", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => entities_3.Invoice),
    (0, typeorm_1.JoinTable)({
        name: 'documents_invoice_technical_process',
        joinColumn: {
            name: 'technicalprocess_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'invoice_id',
            referencedColumnName: 'id',
        },
    }),
    __metadata("design:type", Array)
], TechnicalProcess.prototype, "invoices", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => entities_3.Invoice),
    (0, typeorm_1.JoinTable)({
        name: 'documents_commissioninvoice_technical_process',
        joinColumn: {
            name: 'technicalprocess_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'commissioninvoice_id',
            referencedColumnName: 'id',
        },
    }),
    __metadata("design:type", Array)
], TechnicalProcess.prototype, "commissionInvoices", void 0);
exports.TechnicalProcess = TechnicalProcess = __decorate([
    (0, typeorm_1.Entity)({ name: 'warehouse_technicalprocess' })
], TechnicalProcess);
//# sourceMappingURL=technical-process.entity.js.map