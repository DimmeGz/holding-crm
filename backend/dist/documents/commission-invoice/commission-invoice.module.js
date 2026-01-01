"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommissionInvoiceModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const companies_1 = require("../../companies");
const invoice_1 = require("../invoice");
const entities_1 = require("./entities");
const commission_invoice_service_1 = require("./commission-invoice.service");
const commission_invoice_controller_1 = require("./commission-invoice.controller");
let CommissionInvoiceModule = class CommissionInvoiceModule {
};
exports.CommissionInvoiceModule = CommissionInvoiceModule;
exports.CommissionInvoiceModule = CommissionInvoiceModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([entities_1.CommissionInvoice]),
            companies_1.CompaniesModule,
            invoice_1.InvoiceModule,
        ],
        providers: [commission_invoice_service_1.CommissionInvoiceService],
        controllers: [commission_invoice_controller_1.CommissionInvoiceController],
    })
], CommissionInvoiceModule);
//# sourceMappingURL=commission-invoice.module.js.map