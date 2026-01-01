"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShipmentModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const goods_1 = require("../../goods");
const receive_1 = require("../receive");
const transit_1 = require("../transit");
const warehouse_1 = require("../../warehouse");
const shipment_service_1 = require("./shipment.service");
const shipment_controller_1 = require("./shipment.controller");
const entities_1 = require("./entities");
let ShipmentModule = class ShipmentModule {
};
exports.ShipmentModule = ShipmentModule;
exports.ShipmentModule = ShipmentModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([entities_1.Shipment, entities_1.ShipmentLine]),
            goods_1.GoodsModule,
            receive_1.ReceiveModule,
            transit_1.TransitModule,
            warehouse_1.WarehouseModule,
        ],
        providers: [shipment_service_1.ShipmentService],
        controllers: [shipment_controller_1.ShipmentController],
        exports: [shipment_service_1.ShipmentService],
    })
], ShipmentModule);
//# sourceMappingURL=shipment.module.js.map