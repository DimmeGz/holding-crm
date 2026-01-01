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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommissionPaymentController = void 0;
const common_1 = require("@nestjs/common");
const commission_payment_service_1 = require("./commission-payment.service");
const dto_1 = require("./dto");
let CommissionPaymentController = class CommissionPaymentController {
    constructor(commissionPaymentService) {
        this.commissionPaymentService = commissionPaymentService;
    }
    getCommisionPayments() {
        return this.commissionPaymentService.getCommisionPayments();
    }
    getCommisionPaymentById(commissionPaymentId) {
        return this.commissionPaymentService.getCommisionPaymentById(commissionPaymentId);
    }
    createCommissionPayment(createCommissionPaymentDTO) {
        return this.commissionPaymentService.createCommissionPayment(createCommissionPaymentDTO);
    }
    updateCommissionPayment(commissionPaymentId, updateCommissionPaymentDTO) {
        return this.commissionPaymentService.updateCommissionPayment(commissionPaymentId, updateCommissionPaymentDTO);
    }
    removeCommissionPayment(commissionPaymentId) {
        return this.commissionPaymentService.removeCommissionPayment(commissionPaymentId);
    }
    changeCommissionPaymentStatus(commissionPaymentId) {
        return this.commissionPaymentService.changeCommissionPaymentStatus(commissionPaymentId);
    }
};
exports.CommissionPaymentController = CommissionPaymentController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CommissionPaymentController.prototype, "getCommisionPayments", null);
__decorate([
    (0, common_1.Get)(':commissionPaymentId'),
    (0, common_1.UsePipes)(new common_1.ParseIntPipe()),
    __param(0, (0, common_1.Param)('commissionPaymentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CommissionPaymentController.prototype, "getCommisionPaymentById", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateCommissionPaymentDTO]),
    __metadata("design:returntype", Promise)
], CommissionPaymentController.prototype, "createCommissionPayment", null);
__decorate([
    (0, common_1.Patch)(':commissionPaymentId'),
    __param(0, (0, common_1.Param)('commissionPaymentId', new common_1.ParseIntPipe())),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, dto_1.UpdateCommissionPaymentDTO]),
    __metadata("design:returntype", Promise)
], CommissionPaymentController.prototype, "updateCommissionPayment", null);
__decorate([
    (0, common_1.Delete)(':commissionPaymentId'),
    (0, common_1.UsePipes)(new common_1.ParseIntPipe()),
    __param(0, (0, common_1.Param)('commissionPaymentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CommissionPaymentController.prototype, "removeCommissionPayment", null);
__decorate([
    (0, common_1.Patch)('change-status/:commissionPaymentId'),
    (0, common_1.UsePipes)(new common_1.ParseIntPipe()),
    __param(0, (0, common_1.Param)('commissionPaymentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CommissionPaymentController.prototype, "changeCommissionPaymentStatus", null);
exports.CommissionPaymentController = CommissionPaymentController = __decorate([
    (0, common_1.Controller)('commission_payment'),
    __metadata("design:paramtypes", [commission_payment_service_1.CommissionPaymentService])
], CommissionPaymentController);
//# sourceMappingURL=commission-payment.controller.js.map