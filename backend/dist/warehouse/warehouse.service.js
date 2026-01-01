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
exports.WarehouseService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("./entities");
let WarehouseService = class WarehouseService {
    constructor(warehouseAccountingRepository) {
        this.warehouseAccountingRepository = warehouseAccountingRepository;
    }
    createBaseQueryBuilder() {
        return this.warehouseAccountingRepository
            .createQueryBuilder('warehouseAccounting')
            .where('warehouseAccounting.qty != 0');
    }
    applyWarehouseAccountingListSelect(qb) {
        return qb
            .leftJoin('warehouseAccounting.batch', 'batch')
            .leftJoin('batch.product', 'product')
            .leftJoin('warehouseAccounting.package', 'package')
            .leftJoin('warehouseAccounting.warehouse', 'warehouse')
            .leftJoin('warehouseAccounting.company', 'company')
            .leftJoin('warehouseAccounting.currency', 'currency')
            .select([
            'warehouseAccounting.id',
            'warehouseAccounting.qty',
            'warehouseAccounting.cost',
            'product.id',
            'product.name',
            'batch.id',
            'batch.name',
            'package.name',
            'warehouse.id',
            'warehouse.name',
            'company.id',
            'company.name',
            'currency.name',
        ]);
    }
    applyQueryFilter(qb, query) {
        console.log(query);
        if (query.company) {
            qb.andWhere('warehouseAccounting.companyId = :companyId', {
                companyId: query.company,
            });
        }
        if (query.warehouse) {
            qb.andWhere('warehouseAccounting.warehouseId = :warehouseId', {
                warehouseId: query.warehouse,
            });
        }
        if (query.process) {
            qb.leftJoin('product.technicalProcesses', 'process').andWhere('process.id = :processId', { processId: query.process });
        }
        return qb;
    }
    async getWarehouseAccountings(query) {
        return await this.applyQueryFilter(this.applyWarehouseAccountingListSelect(this.createBaseQueryBuilder()), query)
            .orderBy('product.name', 'ASC')
            .getMany();
    }
    async getWareCost(wareData) {
        const warehouseAccounting = await this.createBaseQueryBuilder()
            .where('warehouseAccounting.batchId = :batchId', {
            batchId: wareData.batchId,
        })
            .andWhere('warehouseAccounting.packageId = :packageId', {
            packageId: wareData.packageId,
        })
            .andWhere('warehouseAccounting.warehouseId = :warehouseId', {
            warehouseId: wareData.warehouseId,
        })
            .andWhere('warehouseAccounting.companyId = :companyId', {
            companyId: wareData.companyId,
        })
            .andWhere('warehouseAccounting.currencyId = :currencyId', {
            currencyId: wareData.currencyId,
        })
            .getOne();
        return warehouseAccounting?.cost || 0;
    }
    async changeGoodsCount(changeGoodsCountDTO, isIncrease) {
        const { companyId, warehouseId, batchId, packageId } = changeGoodsCountDTO;
        const queryBuilder = this.createBaseQueryBuilder()
            .where('warehouseAccounting.companyId = :companyId', { companyId })
            .andWhere('warehouseAccounting.warehouseId = :warehouseId', {
            warehouseId,
        })
            .andWhere('warehouseAccounting.batchId = :batchId', { batchId })
            .andWhere('warehouseAccounting.packageId = :packageId', { packageId });
        if ('currencyId' in changeGoodsCountDTO) {
            queryBuilder.andWhere('warehouseAccounting.currencyId = :currencyId', {
                currencyId: changeGoodsCountDTO.currencyId,
            });
        }
        const warehouseAccounting = await queryBuilder.getOne();
        if (!warehouseAccounting) {
            return;
        }
        if (isIncrease) {
            if ('price' in changeGoodsCountDTO) {
                const totalCost = warehouseAccounting.cost * warehouseAccounting.qty +
                    changeGoodsCountDTO.price * changeGoodsCountDTO.qty;
                warehouseAccounting.qty += changeGoodsCountDTO.qty;
                warehouseAccounting.cost = totalCost / warehouseAccounting.qty;
            }
            else {
                warehouseAccounting.qty += changeGoodsCountDTO.qty;
            }
        }
        else {
            if ('price' in changeGoodsCountDTO) {
                const newTotalCost = warehouseAccounting.cost * warehouseAccounting.qty -
                    changeGoodsCountDTO.price * changeGoodsCountDTO.qty;
                warehouseAccounting.qty -= changeGoodsCountDTO.qty;
                if (!warehouseAccounting.qty) {
                    await this.warehouseAccountingRepository.remove(warehouseAccounting);
                    return;
                }
                warehouseAccounting.cost = newTotalCost / warehouseAccounting.qty;
            }
            else {
                warehouseAccounting.qty -= changeGoodsCountDTO.qty;
            }
        }
        await this.warehouseAccountingRepository.save(warehouseAccounting);
    }
    async decreaseShipGoodsCount(decreaseGoodsCountDTO) {
        await this.changeGoodsCount(decreaseGoodsCountDTO, false);
    }
    async returnShipGoodsCount(returnGoodsCountDTO) {
        await this.changeGoodsCount(returnGoodsCountDTO, true);
    }
    async increaseReceiveGoodsCount(increaseGoodsCountDTO) {
        let warehouseAccounting = await this.createBaseQueryBuilder()
            .where('warehouseAccounting.companyId = :companyId', {
            companyId: increaseGoodsCountDTO.companyId,
        })
            .andWhere('warehouseAccounting.warehouseId = :warehouseId', {
            warehouseId: increaseGoodsCountDTO.warehouseId,
        })
            .andWhere('warehouseAccounting.batchId = :batchId', {
            batchId: increaseGoodsCountDTO.batchId,
        })
            .andWhere('warehouseAccounting.packageId = :packageId', {
            packageId: increaseGoodsCountDTO.packageId,
        })
            .andWhere('warehouseAccounting.currencyId = :currencyId', {
            currencyId: increaseGoodsCountDTO.currencyId,
        })
            .getOne();
        if (!warehouseAccounting) {
            warehouseAccounting = new entities_1.WarehouseAccounting(increaseGoodsCountDTO);
            warehouseAccounting.cost = increaseGoodsCountDTO.price;
            warehouseAccounting.qty = increaseGoodsCountDTO.qty;
        }
        else {
            await this.changeGoodsCount(increaseGoodsCountDTO, true);
            return;
        }
        await this.warehouseAccountingRepository.save(warehouseAccounting);
    }
    async returnReceiveGoodsCount(returnGoodsCountDTO) {
        await this.changeGoodsCount(returnGoodsCountDTO, false);
    }
    async transportProducts(transportDTO) {
        const linesToSave = [];
        const transportPromises = transportDTO.transportLines.map(async (line) => {
            const baseQueryBuilder = this.createBaseQueryBuilder()
                .where('warehouseAccounting.companyId = :companyId', {
                companyId: transportDTO.companyId,
            })
                .andWhere('warehouseAccounting.batchId = :batchId', {
                batchId: line.batchId,
            })
                .andWhere('warehouseAccounting.packageId = :packageId', {
                packageId: line.packageId,
            });
            const fromLine = await baseQueryBuilder
                .andWhere('warehouseAccounting.warehouseId = :warehouseId', {
                warehouseId: transportDTO.warehouseSenderId,
            })
                .getOne();
            if (!fromLine) {
                throw new common_1.NotFoundException('WarehouseAccounting not found');
            }
            let toLine = await baseQueryBuilder
                .andWhere('warehouseAccounting.warehouseId = :warehouseId', {
                warehouseId: transportDTO.warehouseReceiveId,
            })
                .getOne();
            fromLine.qty -= line.qty;
            linesToSave.push(fromLine);
            if (!toLine) {
                toLine = new entities_1.WarehouseAccounting({
                    companyId: transportDTO.companyId,
                    batchId: line.batchId,
                    packageId: line.packageId,
                    warehouseId: transportDTO.warehouseReceiveId,
                    qty: line.qty,
                    cost: fromLine.cost + transportDTO.transportCost,
                    currencyId: fromLine.currencyId,
                });
            }
            else {
                const totalCost = toLine.cost * toLine.qty + fromLine.cost * line.qty;
                toLine.qty += line.qty;
                toLine.cost = totalCost / toLine.qty + transportDTO.transportCost;
            }
            linesToSave.push(toLine);
        });
        await Promise.all(transportPromises);
        await this.warehouseAccountingRepository.save(linesToSave);
    }
    async unTransportProducts(transportDTO) {
        const linesToSave = [];
        const unTransportPromises = transportDTO.transportLines.map(async (line) => {
            const baseQueryBuilder = this.createBaseQueryBuilder()
                .where('warehouseAccounting.companyId = :companyId', {
                companyId: transportDTO.companyId,
            })
                .andWhere('warehouseAccounting.batchId = :batchId', {
                batchId: line.batchId,
            })
                .andWhere('warehouseAccounting.packageId = :packageId', {
                packageId: line.packageId,
            });
            const fromLine = await baseQueryBuilder
                .andWhere('warehouseAccounting.warehouseId = :warehouseId', {
                warehouseId: transportDTO.warehouseSenderId,
            })
                .getOne();
            const toLine = await baseQueryBuilder
                .andWhere('warehouseAccounting.warehouseId = :warehouseId', {
                warehouseId: transportDTO.warehouseReceiveId,
            })
                .getOne();
            if (!fromLine || !toLine) {
                throw new common_1.NotFoundException('WarehouseAccounting not found');
            }
            fromLine.qty += line.qty;
            toLine.qty -= line.qty;
            toLine.cost =
                (toLine.cost * toLine.qty -
                    fromLine.cost * line.qty -
                    transportDTO.transportCost * line.qty) /
                    toLine.qty;
            linesToSave.push(fromLine, toLine);
        });
        await Promise.all(unTransportPromises);
        await this.warehouseAccountingRepository.save(linesToSave);
    }
    async makeProduction(makeProductionDTO) {
        const linesToSave = [];
        const outLinePromises = makeProductionDTO.outLines.map(async (line) => {
            const outLine = await this.createBaseQueryBuilder()
                .where('warehouseAccounting.batchId = :batchId', {
                batchId: line.batchId,
            })
                .andWhere('warehouseAccounting.packageId = :packageId', {
                packageId: line.packageId,
            })
                .andWhere('warehouseAccounting.companyId = :companyId', {
                companyId: makeProductionDTO.companyId,
            })
                .andWhere('warehouseAccounting.warehouseId = :warehouseId', {
                warehouseId: makeProductionDTO.warehouseId,
            })
                .getOne();
            if (!outLine) {
                throw new common_1.NotFoundException('WarehouseAccounting not found');
            }
            outLine.qty += makeProductionDTO.status ? -line.qty : line.qty;
            return outLine;
        });
        const inLinePromises = makeProductionDTO.inLines.map(async (line) => {
            let inLine = await this.createBaseQueryBuilder()
                .where('warehouseAccounting.batchId = :batchId', {
                batchId: line.batchId,
            })
                .andWhere('warehouseAccounting.packageId = :packageId', {
                packageId: line.packageId,
            })
                .andWhere('warehouseAccounting.companyId = :companyId', {
                companyId: makeProductionDTO.companyId,
            })
                .andWhere('warehouseAccounting.warehouseId = :warehouseId', {
                warehouseId: makeProductionDTO.warehouseId,
            })
                .getOne();
            if (!inLine) {
                inLine = new entities_1.WarehouseAccounting({
                    ...line,
                    companyId: makeProductionDTO.companyId,
                    warehouseId: makeProductionDTO.warehouseId,
                });
            }
            inLine.qty += makeProductionDTO.status ? line.qty : -line.qty;
            return inLine;
        });
        const [outLines, inLines] = await Promise.all([
            Promise.all(outLinePromises),
            Promise.all(inLinePromises),
        ]);
        linesToSave.push(...outLines, ...inLines);
        await this.warehouseAccountingRepository.save(linesToSave);
    }
};
exports.WarehouseService = WarehouseService;
exports.WarehouseService = WarehouseService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.WarehouseAccounting)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], WarehouseService);
//# sourceMappingURL=warehouse.service.js.map