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
exports.CustomField = void 0;
const typeorm_1 = require("typeorm");
const entities_1 = require("../../common/entities");
let CustomField = class CustomField extends entities_1.AbstractEntity {
};
exports.CustomField = CustomField;
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 24,
    }),
    __metadata("design:type", String)
], CustomField.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 50,
        nullable: true,
    }),
    __metadata("design:type", String)
], CustomField.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 50,
        nullable: true,
    }),
    __metadata("design:type", String)
], CustomField.prototype, "description2", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'default_value',
        type: 'varchar',
        length: 50,
        nullable: true,
    }),
    __metadata("design:type", String)
], CustomField.prototype, "defaultValue", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 50,
        nullable: true,
    }),
    __metadata("design:type", String)
], CustomField.prototype, "unit", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 15,
        nullable: true,
    }),
    __metadata("design:type", String)
], CustomField.prototype, "qc", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'smallint',
        default: 0,
    }),
    __metadata("design:type", String)
], CustomField.prototype, "priority", void 0);
exports.CustomField = CustomField = __decorate([
    (0, typeorm_1.Entity)({ name: 'warehouse_customfields' })
], CustomField);
//# sourceMappingURL=custom-field.entity.js.map