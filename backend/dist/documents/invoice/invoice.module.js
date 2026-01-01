"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const companies_1 = require("../../companies");
const goods_1 = require("../../goods");
const shipment_1 = require("../shipment");
const orders_1 = require("../orders");
const payment_1 = require("../payment");
const warehouse_1 = require("../../warehouse");
const entities_1 = require("./entities");
const invoice_service_1 = require("./invoice.service");
const invoice_controller_1 = require("./invoice.controller");
let InvoiceModule = class InvoiceModule {
};
exports.InvoiceModule = InvoiceModule;
exports.InvoiceModule = InvoiceModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([entities_1.Invoice]),
            companies_1.CompaniesModule,
            goods_1.GoodsModule,
            (0, common_1.forwardRef)(() => payment_1.PaymentModule),
            shipment_1.ShipmentModule,
            warehouse_1.WarehouseModule,
            (0, common_1.forwardRef)(() => orders_1.OrdersModule),
        ],
        providers: [invoice_service_1.InvoiceService],
        controllers: [invoice_controller_1.InvoiceController],
        exports: [invoice_service_1.InvoiceService],
    })
], InvoiceModule);
//# sourceMappingURL=invoice.module.js.map