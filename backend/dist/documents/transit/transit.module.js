"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransitModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const libs_1 = require("../../libs");
const entities_1 = require("./entities");
const transit_service_1 = require("./transit.service");
const transit_controller_1 = require("./transit.controller");
let TransitModule = class TransitModule {
};
exports.TransitModule = TransitModule;
exports.TransitModule = TransitModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([entities_1.TransitLine]), libs_1.LibsModule],
        providers: [transit_service_1.TransitService],
        exports: [transit_service_1.TransitService],
        controllers: [transit_controller_1.TransitController],
    })
], TransitModule);
//# sourceMappingURL=transit.module.js.map