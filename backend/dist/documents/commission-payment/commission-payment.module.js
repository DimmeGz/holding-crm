"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommissionPaymentModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const companies_1 = require("../../companies");
const libs_1 = require("../../libs");
const entities_1 = require("./entities");
const commission_payment_service_1 = require("./commission-payment.service");
const commission_payment_controller_1 = require("./commission-payment.controller");
let CommissionPaymentModule = class CommissionPaymentModule {
};
exports.CommissionPaymentModule = CommissionPaymentModule;
exports.CommissionPaymentModule = CommissionPaymentModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([entities_1.CommissionPayment]),
            companies_1.CompaniesModule,
            libs_1.LibsModule,
        ],
        providers: [commission_payment_service_1.CommissionPaymentService],
        controllers: [commission_payment_controller_1.CommissionPaymentController],
    })
], CommissionPaymentModule);
//# sourceMappingURL=commission-payment.module.js.map