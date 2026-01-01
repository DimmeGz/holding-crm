"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentsModule = void 0;
const common_1 = require("@nestjs/common");
const contracts_1 = require("./contracts");
const commission_invoice_1 = require("./commission-invoice");
const commission_payment_1 = require("./commission-payment");
const production_1 = require("./production");
const product_transport_1 = require("./product-transport");
let DocumentsModule = class DocumentsModule {
};
exports.DocumentsModule = DocumentsModule;
exports.DocumentsModule = DocumentsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            contracts_1.ContractsModule,
            commission_invoice_1.CommissionInvoiceModule,
            commission_payment_1.CommissionPaymentModule,
            production_1.ProductionModule,
            product_transport_1.ProductTransportModule,
        ],
    })
], DocumentsModule);
//# sourceMappingURL=documents.module.js.map