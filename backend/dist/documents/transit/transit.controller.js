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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransitController = void 0;
const common_1 = require("@nestjs/common");
const transit_service_1 = require("./transit.service");
let TransitController = class TransitController {
    constructor(transitService) {
        this.transitService = transitService;
    }
    getTransitLines() {
        return this.transitService.getTransitLines();
    }
};
exports.TransitController = TransitController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TransitController.prototype, "getTransitLines", null);
exports.TransitController = TransitController = __decorate([
    (0, common_1.Controller)('transit'),
    __metadata("design:paramtypes", [transit_service_1.TransitService])
], TransitController);
//# sourceMappingURL=transit.controller.js.map