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
exports.CommissionInvoiceController = void 0;
const common_1 = require("@nestjs/common");
const commission_invoice_service_1 = require("./commission-invoice.service");
const dto_1 = require("./dto");
let CommissionInvoiceController = class CommissionInvoiceController {
    constructor(commissionInvoiceService) {
        this.commissionInvoiceService = commissionInvoiceService;
    }
    getCommissionInvoicess() {
        return this.commissionInvoiceService.getCommissionInvoicess();
    }
    getCommissionInvoiceById(commissionId) {
        return this.commissionInvoiceService.getCommissionInvoiceById(commissionId);
    }
    createCommissionInvoice(createCommissionInvoiceDTO) {
        return this.commissionInvoiceService.createCommissionInvoice(createCommissionInvoiceDTO);
    }
    updateCommissionInvoice(commissionId, updateCommissionInvoiceDTO) {
        return this.commissionInvoiceService.updateCommissionInvoice(commissionId, updateCommissionInvoiceDTO);
    }
    removeCommission(commissionId) {
        return this.commissionInvoiceService.removeCommission(commissionId);
    }
    changeCommissionStatus(commissionId) {
        return this.commissionInvoiceService.changeCommissionStatus(commissionId);
    }
};
exports.CommissionInvoiceController = CommissionInvoiceController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CommissionInvoiceController.prototype, "getCommissionInvoicess", null);
__decorate([
    (0, common_1.Get)(':commissionId'),
    (0, common_1.UsePipes)(new common_1.ParseIntPipe()),
    __param(0, (0, common_1.Param)('commissionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CommissionInvoiceController.prototype, "getCommissionInvoiceById", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateCommissionInvoiceDTO]),
    __metadata("design:returntype", Promise)
], CommissionInvoiceController.prototype, "createCommissionInvoice", null);
__decorate([
    (0, common_1.Patch)(':commissionId'),
    __param(0, (0, common_1.Param)('commissionId', new common_1.ParseIntPipe())),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, dto_1.UpdateCommissionInvoiceDTO]),
    __metadata("design:returntype", Promise)
], CommissionInvoiceController.prototype, "updateCommissionInvoice", null);
__decorate([
    (0, common_1.Delete)(':commissionId'),
    (0, common_1.UsePipes)(new common_1.ParseIntPipe()),
    __param(0, (0, common_1.Param)('commissionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CommissionInvoiceController.prototype, "removeCommission", null);
__decorate([
    (0, common_1.Patch)('change-status/:commissionId'),
    (0, common_1.UsePipes)(new common_1.ParseIntPipe()),
    __param(0, (0, common_1.Param)('commissionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CommissionInvoiceController.prototype, "changeCommissionStatus", null);
exports.CommissionInvoiceController = CommissionInvoiceController = __decorate([
    (0, common_1.Controller)('commission'),
    __metadata("design:paramtypes", [commission_invoice_service_1.CommissionInvoiceService])
], CommissionInvoiceController);
//# sourceMappingURL=commission-invoice.controller.js.map