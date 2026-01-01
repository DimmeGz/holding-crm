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
exports.ContractsController = void 0;
const common_1 = require("@nestjs/common");
const contracts_service_1 = require("./contracts.service");
const dto_1 = require("./dto");
const query_dto_1 = require("./dto/query-dto");
let ContractsController = class ContractsController {
    constructor(contractsService) {
        this.contractsService = contractsService;
    }
    getContracts(query) {
        return this.contractsService.getContracts(query);
    }
    getContractById(contractId) {
        return this.contractsService.getContractById(contractId);
    }
    createContract(createContractDTO) {
        return this.contractsService.createContract(createContractDTO);
    }
    updateContract(contractId, updateContractDTO) {
        return this.contractsService.updateContract(contractId, updateContractDTO);
    }
    removeContract(contractId) {
        return this.contractsService.removeContract(contractId);
    }
    changeContractStatus(contractId) {
        return this.contractsService.changeContractStatus(contractId);
    }
};
exports.ContractsController = ContractsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_dto_1.GetContractsQueryDTO]),
    __metadata("design:returntype", void 0)
], ContractsController.prototype, "getContracts", null);
__decorate([
    (0, common_1.Get)('/:contractId'),
    (0, common_1.UsePipes)(new common_1.ParseIntPipe()),
    __param(0, (0, common_1.Param)('contractId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ContractsController.prototype, "getContractById", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateContractDTO]),
    __metadata("design:returntype", Promise)
], ContractsController.prototype, "createContract", null);
__decorate([
    (0, common_1.Patch)(':contractId'),
    __param(0, (0, common_1.Param)('contractId', new common_1.ParseIntPipe())),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, dto_1.UpdateContractDTO]),
    __metadata("design:returntype", Promise)
], ContractsController.prototype, "updateContract", null);
__decorate([
    (0, common_1.Delete)(':contractId'),
    (0, common_1.UsePipes)(new common_1.ParseIntPipe()),
    __param(0, (0, common_1.Param)('contractId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ContractsController.prototype, "removeContract", null);
__decorate([
    (0, common_1.Patch)('change-status/:contractId'),
    (0, common_1.UsePipes)(new common_1.ParseIntPipe()),
    __param(0, (0, common_1.Param)('contractId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ContractsController.prototype, "changeContractStatus", null);
exports.ContractsController = ContractsController = __decorate([
    (0, common_1.Controller)('contracts'),
    __metadata("design:paramtypes", [contracts_service_1.ContractsService])
], ContractsController);
//# sourceMappingURL=contracts.controller.js.map