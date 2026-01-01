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
exports.TransitService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const libs_1 = require("../../libs");
const entities_1 = require("./entities");
let TransitService = class TransitService {
    constructor(transitLinesRepository, libsService) {
        this.transitLinesRepository = transitLinesRepository;
        this.libsService = libsService;
    }
    createBaseQueryBuilder() {
        return this.transitLinesRepository.createQueryBuilder('transitLine');
    }
    applyTransitLineListSelect(qb) {
        return qb
            .leftJoin('transitLine.shipment', 'shipment')
            .leftJoin('shipment.seller', 'seller')
            .leftJoin('transitLine.receive', 'receive')
            .leftJoin('receive.buyer', 'buyer')
            .leftJoin('transitLine.batch', 'batch')
            .leftJoin('batch.product', 'product')
            .leftJoin('transitLine.package', 'package')
            .select([
            'transitLine.id',
            'transitLine.qty',
            'seller.id',
            'seller.name',
            'buyer.id',
            'buyer.name',
            'shipment.id',
            'shipment.expectedDate',
            'receive.id',
            'receive.expectedDate',
            'product.id',
            'product.name',
            'batch.id',
            'batch.name',
            'package.id',
            'package.name',
        ]);
    }
    async getTransitLines() {
        return await this.applyTransitLineListSelect(this.createBaseQueryBuilder())
            .where('transitLine.qty != 0')
            .getMany();
    }
    async createTransitLine(createTransitLineDTO) {
        const newTransitLines = [];
        for (const line of createTransitLineDTO.lines) {
            const newTransitLine = this.transitLinesRepository.create({
                shipmentId: createTransitLineDTO.shipmentId,
                ...line,
            });
            newTransitLine.technicalProcesses =
                await this.libsService.getTechnicalProcessesByBatchId(line.batchId);
            newTransitLines.push(newTransitLine);
        }
        await this.transitLinesRepository.save(newTransitLines);
    }
    async removeTransitLines(shipmentId) {
        await this.transitLinesRepository.delete({ shipmentId });
    }
    async addReceiveToTransitLines(addReceiveDTO) {
        const linesToUpdate = await Promise.all(addReceiveDTO.lines.map(async (line) => {
            const transitLine = await this.transitLinesRepository.findOneBy({
                shipmentId: addReceiveDTO.shipmentId,
                batchId: line.batchId,
                packageId: line.packageId,
            });
            transitLine.receiveId = addReceiveDTO.receiveId;
            return transitLine;
        }));
        await this.transitLinesRepository.save(linesToUpdate);
    }
    async receiveTransitLines(receiveDTO) {
        await this.updateTransitLinesQty(receiveDTO, false);
    }
    async cancelReceiveTransitLines(receiveDTO) {
        await this.updateTransitLinesQty(receiveDTO, true);
    }
    async updateTransitLinesQty(receiveDTO, isCancel) {
        const linesToUpdate = await Promise.all(receiveDTO.lines.map(async (line) => {
            const transitLine = await this.transitLinesRepository.findOneBy({
                receiveId: receiveDTO.receiveId,
                batchId: line.batchId,
                packageId: line.packageId,
            });
            transitLine.qty += isCancel ? line.qty : -line.qty;
            return transitLine;
        }));
        await this.transitLinesRepository.save(linesToUpdate);
    }
};
exports.TransitService = TransitService;
exports.TransitService = TransitService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.TransitLine)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        libs_1.LibsService])
], TransitService);
//# sourceMappingURL=transit.service.js.map