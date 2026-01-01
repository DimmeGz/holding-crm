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
exports.InvoiceController = void 0;
const common_1 = require("@nestjs/common");
const invoice_service_1 = require("./invoice.service");
const dto_1 = require("./dto");
const query_dto_1 = require("./dto/query-dto");
let InvoiceController = class InvoiceController {
    constructor(invoiceService) {
        this.invoiceService = invoiceService;
    }
    getInvoices(query) {
        return this.invoiceService.getInvoices(query);
    }
    getInvoiceById(invoiceId) {
        return this.invoiceService.getInvoiceById(invoiceId);
    }
    createInvoice(createInvoiceDTO) {
        return this.invoiceService.createInvoice(createInvoiceDTO);
    }
    createInvoiceByContract(createInvoiceByContractDTO) {
        return this.invoiceService.createInvoiceByContract(createInvoiceByContractDTO);
    }
    updateInvoice(invoiceId, updateInvoiceDTO) {
        return this.invoiceService.updateInvoice(invoiceId, updateInvoiceDTO);
    }
    removeInvoice(invoiceId) {
        return this.invoiceService.removeInvoice(invoiceId);
    }
    changeInvoiceStatus(invoiceId) {
        return this.invoiceService.changeInvoiceStatus(invoiceId);
    }
};
exports.InvoiceController = InvoiceController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_dto_1.GetInvoicesQueryDTO]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "getInvoices", null);
__decorate([
    (0, common_1.Get)(':invoiceId'),
    (0, common_1.UsePipes)(new common_1.ParseIntPipe()),
    __param(0, (0, common_1.Param)('invoiceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "getInvoiceById", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateInvoiceDTO]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "createInvoice", null);
__decorate([
    (0, common_1.Post)('by-contract'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateInvoiceByContractDTO]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "createInvoiceByContract", null);
__decorate([
    (0, common_1.Patch)(':invoiceId'),
    __param(0, (0, common_1.Param)('invoiceId', new common_1.ParseIntPipe())),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, dto_1.UpdateInvoiceDTO]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "updateInvoice", null);
__decorate([
    (0, common_1.Delete)(':invoiceId'),
    (0, common_1.UsePipes)(new common_1.ParseIntPipe()),
    __param(0, (0, common_1.Param)('invoiceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "removeInvoice", null);
__decorate([
    (0, common_1.Patch)('change-status/:invoiceId'),
    (0, common_1.UsePipes)(new common_1.ParseIntPipe()),
    __param(0, (0, common_1.Param)('invoiceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "changeInvoiceStatus", null);
exports.InvoiceController = InvoiceController = __decorate([
    (0, common_1.Controller)('invoices'),
    __metadata("design:paramtypes", [invoice_service_1.InvoiceService])
], InvoiceController);
//# sourceMappingURL=invoice.controller.js.map