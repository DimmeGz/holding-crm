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
exports.BatchCustomField = void 0;
const typeorm_1 = require("typeorm");
const entities_1 = require("../../common/entities");
const batch_entity_1 = require("./batch.entity");
const custom_field_entity_1 = require("./custom-field.entity");
let BatchCustomField = class BatchCustomField extends entities_1.AbstractEntity {
};
exports.BatchCustomField = BatchCustomField;
__decorate([
    (0, typeorm_1.ManyToOne)(() => batch_entity_1.Batch, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'batch_id' }),
    __metadata("design:type", batch_entity_1.Batch)
], BatchCustomField.prototype, "batch", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => custom_field_entity_1.CustomField, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'custom_field_id' }),
    __metadata("design:type", custom_field_entity_1.CustomField)
], BatchCustomField.prototype, "customField", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 50,
        nullable: true,
    }),
    __metadata("design:type", String)
], BatchCustomField.prototype, "value", void 0);
exports.BatchCustomField = BatchCustomField = __decorate([
    (0, typeorm_1.Entity)({ name: 'warehouse_batchescustomfields' })
], BatchCustomField);
//# sourceMappingURL=batch-custom-field.entity.js.map