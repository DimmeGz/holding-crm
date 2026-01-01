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
exports.ContractsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const goods_1 = require("../../goods");
const orders_1 = require("../orders");
const shipment_1 = require("../shipment");
const utils_1 = require("../../common/utils");
const entities_1 = require("./entities");
const enums_1 = require("../common/enums");
let ContractsService = class ContractsService {
    constructor(contractsRepository, ordersService, shipmentsService, goodsService, dataSource) {
        this.contractsRepository = contractsRepository;
        this.ordersService = ordersService;
        this.shipmentsService = shipmentsService;
        this.goodsService = goodsService;
        this.dataSource = dataSource;
    }
    createBaseQueryBuilder() {
        return this.contractsRepository.createQueryBuilder('contract');
    }
    applyContractListSelect(qb) {
        return qb
            .leftJoin('contract.seller', 'seller')
            .leftJoin('contract.buyer', 'buyer')
            .select([
            'contract.id',
            'contract.name',
            'seller.name',
            'buyer.name',
            'contract.signatureDate',
            'contract.term',
        ]);
    }
    applyContractDetailSelect(qb) {
        return qb
            .leftJoin('contract.seller', 'seller')
            .leftJoin('contract.buyer', 'buyer')
            .leftJoin('contract.currency', 'currency')
            .leftJoin('contract.incoterms', 'incoterms')
            .leftJoin('contract.contractLines', 'contractLine')
            .leftJoin('contractLine.product', 'product')
            .leftJoin('contractLine.package', 'package')
            .leftJoin('contract.contractServiceLines', 'contractServiceLine')
            .leftJoin('contractServiceLine.service', 'service')
            .select([
            'contract.id',
            'contract.name',
            'contract.status',
            'contract.signatureDate',
            'contract.term',
            'contract.vat',
            'contract.paymentDelay',
            'contract.term',
            'contract.transportPlace',
            'contract.orderPrefix',
            'seller.name',
            'buyer.name',
            'currency.name',
            'incoterms.name',
            'contractLine.id',
            'contractLine.qty',
            'contractLine.shipQty',
            'contractLine.price',
            'product.id',
            'product.name',
            'package.name',
            'contractServiceLine.id',
            'contractServiceLine.price',
            'contractServiceLine.qty',
            'service.name',
        ]);
    }
    ApplyQueryFilter(qb, query) {
        if (!query || Object.keys(query).length === 0) {
            return qb;
        }
        if (query.type) {
            if (query.type === enums_1.DocumentTypeEnum.SELLER) {
                qb.andWhere('contract.sellerId = :sellerId', {
                    sellerId: query.company,
                });
            }
            else {
                qb.andWhere('contract.buyerId = :buyerId', {
                    buyerId: query.company,
                });
            }
        }
        else if (query.company) {
            qb.andWhere('(contract.sellerId = :company OR contract.buyerId = :company)', { company: query.company });
        }
        if (query.process) {
            qb.leftJoin('contract.technicalProcesses', 'technicalProcess').andWhere('technicalProcess.id = :processId', {
                processId: query.process,
            });
        }
        return qb;
    }
    async getContracts(query) {
        const actualContractsQuery = this.applyContractListSelect(this.ApplyQueryFilter(this.createBaseQueryBuilder(), query))
            .andWhere('contract.isArchived = false')
            .andWhere('contract.parent IS NULL');
        const archivedContractsQuery = this.applyContractListSelect(this.ApplyQueryFilter(this.createBaseQueryBuilder(), query))
            .andWhere('contract.isArchived = true')
            .andWhere('contract.parent IS NULL');
        const actualContractsWithArchivedChildrenQuery = this.ApplyQueryFilter(this.createBaseQueryBuilder(), query)
            .andWhere('contract.isArchived = false')
            .andWhere('contract.parent IS NULL')
            .leftJoin('contract.children', 'children')
            .andWhere('children.isArchived = true');
        const actualContracts = await actualContractsQuery.getMany();
        const archivedContracts = await archivedContractsQuery.getMany();
        const archivedChildContracts = await this.applyContractListSelect(actualContractsWithArchivedChildrenQuery).getMany();
        const allArchivedContracts = [
            ...archivedContracts,
            ...archivedChildContracts,
        ];
        return {
            actualContracts,
            archivedContracts: allArchivedContracts,
        };
    }
    async getContractById(contractId) {
        const contract = await this.applyContractDetailSelect(this.createBaseQueryBuilder())
            .where('contract.id = :contractId', { contractId })
            .getOne();
        if (!contract) {
            throw new common_1.NotFoundException(`Contract with id ${contractId} not found`);
        }
        const shippedProducts = await this.shipmentsService.getShippedProductsByContract(contractId);
        for (const contractLine of contract.contractLines) {
            contractLine['shipLeft'] = shippedProducts[contractLine.product.id]
                ? contractLine.qty - shippedProducts[contractLine.product.id]
                : contractLine.qty;
        }
        const orders = await this.ordersService.getOrdersByContractId(contractId);
        return { contract, orders };
    }
    async createContract(createContractDTO) {
        const newContract = this.contractsRepository.create(createContractDTO);
        newContract.technicalProcesses =
            await this.getTechnicalProcesses(createContractDTO);
        newContract.status = false;
        newContract.isArchived = false;
        newContract.createdAt = new Date();
        newContract.signatureDate =
            newContract.signatureDate || newContract.createdAt;
        newContract.comment = newContract.comment || '';
        newContract.paymentDelay = newContract.paymentDelay || 0;
        newContract.vat = newContract.vat || 0;
        return await this.contractsRepository.save(newContract);
    }
    async getTechnicalProcesses(createContractDTO) {
        const productIds = (0, utils_1.getProductIdsFromProductLines)(createContractDTO.contractLines);
        const productProcesses = await this.goodsService.getTechnicalProcessesFromProductIds(productIds);
        const serviceIds = (0, utils_1.getServiceIdsFromServiceLines)(createContractDTO.contractServiceLines);
        const serviceProcesses = await this.goodsService.getTechnicalProcessesFromServiceIds(serviceIds);
        const technicalProcesses = [
            ...new Set([...productProcesses, ...serviceProcesses]),
        ];
        return technicalProcesses.map((process) => ({ id: process.id }));
    }
    async updateContract(contractId, updateContractDTO) {
        const contract = await this.createBaseQueryBuilder()
            .where('contract.id = :contractId', { contractId })
            .andWhere('contract.status = FALSE')
            .leftJoinAndSelect('contract.contractLines', 'contractLines')
            .leftJoinAndSelect('contract.contractServiceLines', 'contractServiceLines')
            .leftJoinAndSelect('contract.technicalProcesses', 'technicalProcesses')
            .getOne();
        if (!contract) {
            throw new common_1.NotFoundException(`Contract with id: ${contractId} and status: false not found`);
        }
        const updatedContractLinesIds = updateContractDTO.contractLines
            .filter((line) => line['id'])
            .map((line) => line['id']);
        const contractLinesToDelete = contract.contractLines.filter((line) => !updatedContractLinesIds.includes(line.id));
        const updatedContractServiceLinesIds = updateContractDTO.contractServiceLines
            .filter((line) => line['id'])
            .map((line) => line['id']);
        const contractServiceLinesToDelete = contract.contractServiceLines.filter((line) => !updatedContractServiceLinesIds.includes(line.id));
        const updated = Object.assign(contract, updateContractDTO);
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        updated.technicalProcesses =
            await this.getTechnicalProcesses(updateContractDTO);
        try {
            if (contractLinesToDelete.length) {
                await queryRunner.manager.remove(contractLinesToDelete);
            }
            if (contractServiceLinesToDelete.length) {
                await queryRunner.manager.remove(contractServiceLinesToDelete);
            }
            await queryRunner.manager.save(updated);
            await queryRunner.commitTransaction();
            return updated;
        }
        catch (e) {
            await queryRunner.rollbackTransaction();
            throw new common_1.BadRequestException();
        }
        finally {
            await queryRunner.release();
        }
    }
    async removeContract(contractId) {
        const contract = await this.contractsRepository.findOne({
            where: { id: contractId },
            relations: ['contractLines', 'contractServiceLines'],
        });
        if (!contract) {
            throw new common_1.NotFoundException(`Contract with id: ${contractId} not found`);
        }
        return await this.contractsRepository.remove(contract);
    }
    async changeContractStatus(contractId) {
        const contract = await this.contractsRepository.findOne({
            where: { id: contractId },
        });
        if (!contract) {
            throw new common_1.NotFoundException(`Contract with id: ${contractId} not found`);
        }
        contract.status = !contract.status;
        return await this.contractsRepository.save(contract);
    }
    async getOrderPrefix(contractId) {
        const contract = await this.createBaseQueryBuilder()
            .where('contract.id = :contractId', { contractId })
            .select(['contract.id', 'contract.orderPrefix'])
            .getOne();
        if (!contract) {
            throw new common_1.NotFoundException(`Contract with id: ${contractId} not found`);
        }
        return contract.orderPrefix || '';
    }
};
exports.ContractsService = ContractsService;
exports.ContractsService = ContractsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.Contract)),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => orders_1.OrdersService))),
    __param(4, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        orders_1.OrdersService,
        shipment_1.ShipmentService,
        goods_1.GoodsService,
        typeorm_2.DataSource])
], ContractsService);
//# sourceMappingURL=contracts.service.js.map