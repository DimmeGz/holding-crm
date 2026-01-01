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
exports.Warehouse = void 0;
const typeorm_1 = require("typeorm");
const entities_1 = require("../../common/entities");
let Warehouse = class Warehouse extends entities_1.AbstractEntity {
};
exports.Warehouse = Warehouse;
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 50,
    }),
    __metadata("design:type", String)
], Warehouse.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'name_for_print',
        type: 'varchar',
        length: 70,
        nullable: true,
    }),
    __metadata("design:type", String)
], Warehouse.prototype, "nameForPrint", void 0);
exports.Warehouse = Warehouse = __decorate([
    (0, typeorm_1.Entity)({ name: 'warehouse_warehouse' })
], Warehouse);
//# sourceMappingURL=warehouse.entity.js.map