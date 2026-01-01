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
exports.AbstractDocumentRecipientEntity = void 0;
const typeorm_1 = require("typeorm");
const abstract_document_warehouse_entity_1 = require("./abstract-document-warehouse.entity");
const entities_1 = require("../../companies/entities");
const entities_2 = require("../../warehouse/entities");
let AbstractDocumentRecipientEntity = class AbstractDocumentRecipientEntity extends abstract_document_warehouse_entity_1.AbstractDocumentWarehouseEntity {
};
exports.AbstractDocumentRecipientEntity = AbstractDocumentRecipientEntity;
__decorate([
    (0, typeorm_1.ManyToOne)(() => entities_1.Company, {
        onDelete: 'RESTRICT',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'recipient_id' }),
    __metadata("design:type", entities_1.Company)
], AbstractDocumentRecipientEntity.prototype, "recipient", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => entities_2.Warehouse, {
        onDelete: 'RESTRICT',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'recipient_warehouse_id' }),
    __metadata("design:type", entities_2.Warehouse)
], AbstractDocumentRecipientEntity.prototype, "recipientWarehouse", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'recipient_warehouse_id' }),
    __metadata("design:type", Number)
], AbstractDocumentRecipientEntity.prototype, "recipientWarehouseId", void 0);
exports.AbstractDocumentRecipientEntity = AbstractDocumentRecipientEntity = __decorate([
    (0, typeorm_1.Entity)()
], AbstractDocumentRecipientEntity);
//# sourceMappingURL=abstract-document-recipient.entity.js.map