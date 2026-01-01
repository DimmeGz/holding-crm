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
exports.GoodsController = void 0;
const common_1 = require("@nestjs/common");
const goods_service_1 = require("./goods.service");
let GoodsController = class GoodsController {
    constructor(goodsService) {
        this.goodsService = goodsService;
    }
    getBatchData(batchId) {
        return this.goodsService.getBatchData(batchId);
    }
    getProductData(productId) {
        return this.goodsService.getProductData(productId);
    }
};
exports.GoodsController = GoodsController;
__decorate([
    (0, common_1.Get)('batch/:batchId'),
    (0, common_1.UsePipes)(new common_1.ParseIntPipe()),
    __param(0, (0, common_1.Param)('batchId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], GoodsController.prototype, "getBatchData", null);
__decorate([
    (0, common_1.Get)('/product/:productId'),
    (0, common_1.UsePipes)(new common_1.ParseIntPipe()),
    __param(0, (0, common_1.Param)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], GoodsController.prototype, "getProductData", null);
exports.GoodsController = GoodsController = __decorate([
    (0, common_1.Controller)('goods'),
    __metadata("design:paramtypes", [goods_service_1.GoodsService])
], GoodsController);
//# sourceMappingURL=goods.controller.js.map