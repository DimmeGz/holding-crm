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
exports.ProductionController = void 0;
const common_1 = require("@nestjs/common");
const production_service_1 = require("./production.service");
const dto_1 = require("./dto");
let ProductionController = class ProductionController {
    constructor(productionService) {
        this.productionService = productionService;
    }
    async getProductions() {
        return this.productionService.getProductions();
    }
    async getProductionById(productionId) {
        return this.productionService.getProductionById(productionId);
    }
    createProduction(createProductionDTO) {
        return this.productionService.createProduction(createProductionDTO);
    }
    updateProduction(productionId, updateProductionDTO) {
        return this.productionService.updateProduction(productionId, updateProductionDTO);
    }
    removeProduction(productionId) {
        return this.productionService.removeProduction(productionId);
    }
    changeProductionStatus(productionId) {
        return this.productionService.changeProductionStatus(productionId);
    }
};
exports.ProductionController = ProductionController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProductionController.prototype, "getProductions", null);
__decorate([
    (0, common_1.Get)(':productionId'),
    (0, common_1.UsePipes)(new common_1.ParseIntPipe()),
    __param(0, (0, common_1.Param)('productionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ProductionController.prototype, "getProductionById", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateProductionDTO]),
    __metadata("design:returntype", Promise)
], ProductionController.prototype, "createProduction", null);
__decorate([
    (0, common_1.Patch)(':productionId'),
    __param(0, (0, common_1.Param)('productionId', new common_1.ParseIntPipe())),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, dto_1.UpdateProductionDTO]),
    __metadata("design:returntype", Promise)
], ProductionController.prototype, "updateProduction", null);
__decorate([
    (0, common_1.Delete)(':productionId'),
    (0, common_1.UsePipes)(new common_1.ParseIntPipe()),
    __param(0, (0, common_1.Param)('productionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ProductionController.prototype, "removeProduction", null);
__decorate([
    (0, common_1.Patch)('change-status/:productionId'),
    (0, common_1.UsePipes)(new common_1.ParseIntPipe()),
    __param(0, (0, common_1.Param)('productionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ProductionController.prototype, "changeProductionStatus", null);
exports.ProductionController = ProductionController = __decorate([
    (0, common_1.Controller)('production'),
    __metadata("design:paramtypes", [production_service_1.ProductionService])
], ProductionController);
//# sourceMappingURL=production.controller.js.map