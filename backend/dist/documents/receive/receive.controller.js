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
exports.ReceiveController = void 0;
const common_1 = require("@nestjs/common");
const receive_service_1 = require("./receive.service");
const dto_1 = require("./dto");
const query_dto_1 = require("./dto/query-dto");
let ReceiveController = class ReceiveController {
    constructor(receiveService) {
        this.receiveService = receiveService;
    }
    getReceives(query) {
        return this.receiveService.getReceives(query);
    }
    getReceiveById(receiveId) {
        return this.receiveService.getReceiveById(receiveId);
    }
    createReceive(createReveiveDTO) {
        return this.receiveService.createReceive(createReveiveDTO);
    }
    updateReceive(receiveId, updateReceiveDTO) {
        return this.receiveService.updateReceive(receiveId, updateReceiveDTO);
    }
    removeReceive(receiveId) {
        return this.receiveService.removeReceive(receiveId);
    }
    changeShipmentStatus(receiveId) {
        return this.receiveService.changeReceiveStatus(receiveId);
    }
};
exports.ReceiveController = ReceiveController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_dto_1.GetReceivesQueryDTO]),
    __metadata("design:returntype", Promise)
], ReceiveController.prototype, "getReceives", null);
__decorate([
    (0, common_1.Get)(':receiveId'),
    (0, common_1.UsePipes)(new common_1.ParseIntPipe()),
    __param(0, (0, common_1.Param)('receiveId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ReceiveController.prototype, "getReceiveById", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateReveiveDTO]),
    __metadata("design:returntype", Promise)
], ReceiveController.prototype, "createReceive", null);
__decorate([
    (0, common_1.Patch)(':receiveId'),
    __param(0, (0, common_1.Param)('receiveId', new common_1.ParseIntPipe())),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, dto_1.UpdateReceiveDTO]),
    __metadata("design:returntype", Promise)
], ReceiveController.prototype, "updateReceive", null);
__decorate([
    (0, common_1.Delete)(':receiveId'),
    (0, common_1.UsePipes)(new common_1.ParseIntPipe()),
    __param(0, (0, common_1.Param)('receiveId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ReceiveController.prototype, "removeReceive", null);
__decorate([
    (0, common_1.Patch)('change-status/:receiveId'),
    (0, common_1.UsePipes)(new common_1.ParseIntPipe()),
    __param(0, (0, common_1.Param)('receiveId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ReceiveController.prototype, "changeShipmentStatus", null);
exports.ReceiveController = ReceiveController = __decorate([
    (0, common_1.Controller)('receive'),
    __metadata("design:paramtypes", [receive_service_1.ReceiveService])
], ReceiveController);
//# sourceMappingURL=receive.controller.js.map