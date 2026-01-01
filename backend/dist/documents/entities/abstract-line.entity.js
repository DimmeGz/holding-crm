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
exports.AbstractLineEntity = void 0;
const typeorm_1 = require("typeorm");
const entities_1 = require("../../goods/entities");
const abstract_service_line_entity_1 = require("./abstract-service-line.entity");
let AbstractLineEntity = class AbstractLineEntity extends abstract_service_line_entity_1.AbstractServiceLineEntity {
};
exports.AbstractLineEntity = AbstractLineEntity;
__decorate([
    (0, typeorm_1.ManyToOne)(() => entities_1.Package, {
        onDelete: 'RESTRICT',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'package_id' }),
    __metadata("design:type", entities_1.Package)
], AbstractLineEntity.prototype, "package", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'package_id' }),
    __metadata("design:type", Number)
], AbstractLineEntity.prototype, "packageId", void 0);
exports.AbstractLineEntity = AbstractLineEntity = __decorate([
    (0, typeorm_1.Entity)()
], AbstractLineEntity);
//# sourceMappingURL=abstract-line.entity.js.map