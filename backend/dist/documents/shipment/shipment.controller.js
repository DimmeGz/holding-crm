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
exports.ShipmentController = void 0;
const common_1 = require("@nestjs/common");
const shipment_service_1 = require("./shipment.service");
const dto_1 = require("./dto");
const query_dto_1 = require("./dto/query-dto");
let ShipmentController = class ShipmentController {
    constructor(shipmentService) {
        this.shipmentService = shipmentService;
    }
    getShipments(query) {
        return this.shipmentService.getShipments(query);
    }
    getShipmentById(shipmentId) {
        return this.shipmentService.getShipmentById(shipmentId);
    }
    createShipment(createShipmentDTO) {
        return this.shipmentService.createShipment(createShipmentDTO);
    }
    updateShipment(shipmentId, updateShipmentDTO) {
        return this.shipmentService.updateShipment(shipmentId, updateShipmentDTO);
    }
    removeShipment(shipmentId) {
        return this.shipmentService.removeShipment(shipmentId);
    }
    changeShipmentStatus(shipmentId) {
        return this.shipmentService.changeShipmentStatus(shipmentId);
    }
};
exports.ShipmentController = ShipmentController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_dto_1.GetShipmentsQueryDTO]),
    __metadata("design:returntype", Promise)
], ShipmentController.prototype, "getShipments", null);
__decorate([
    (0, common_1.Get)(':shipmentId'),
    (0, common_1.UsePipes)(new common_1.ParseIntPipe()),
    __param(0, (0, common_1.Param)('shipmentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ShipmentController.prototype, "getShipmentById", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateShipmentDTO]),
    __metadata("design:returntype", Promise)
], ShipmentController.prototype, "createShipment", null);
__decorate([
    (0, common_1.Patch)(':shipmentId'),
    __param(0, (0, common_1.Param)('shipmentId', new common_1.ParseIntPipe())),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, dto_1.UpdateShipmentDTO]),
    __metadata("design:returntype", Promise)
], ShipmentController.prototype, "updateShipment", null);
__decorate([
    (0, common_1.Delete)(':shipmentId'),
    (0, common_1.UsePipes)(new common_1.ParseIntPipe()),
    __param(0, (0, common_1.Param)('shipmentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ShipmentController.prototype, "removeShipment", null);
__decorate([
    (0, common_1.Patch)('change-status/:shipmentId'),
    (0, common_1.UsePipes)(new common_1.ParseIntPipe()),
    __param(0, (0, common_1.Param)('shipmentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ShipmentController.prototype, "changeShipmentStatus", null);
exports.ShipmentController = ShipmentController = __decorate([
    (0, common_1.Controller)('shipment'),
    __metadata("design:paramtypes", [shipment_service_1.ShipmentService])
], ShipmentController);
//# sourceMappingURL=shipment.controller.js.map