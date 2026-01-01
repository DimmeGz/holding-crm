"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductTransportModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const libs_1 = require("../../libs");
const warehouse_1 = require("../../warehouse");
const entities_1 = require("./entities");
const product_transport_service_1 = require("./product-transport.service");
const product_transport_controller_1 = require("./product-transport.controller");
let ProductTransportModule = class ProductTransportModule {
};
exports.ProductTransportModule = ProductTransportModule;
exports.ProductTransportModule = ProductTransportModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([entities_1.ProductTransport]),
            libs_1.LibsModule,
            warehouse_1.WarehouseModule,
        ],
        providers: [product_transport_service_1.ProductTransportService],
        controllers: [product_transport_controller_1.ProductTransportController],
    })
], ProductTransportModule);
//# sourceMappingURL=product-transport.module.js.map