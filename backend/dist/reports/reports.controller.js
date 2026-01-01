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
exports.ReportsController = void 0;
const common_1 = require("@nestjs/common");
const production_report_service_1 = require("./production-report.service");
const month_report_service_1 = require("./month-report.service");
const query_dto_1 = require("./dto/query-dto");
let ReportsController = class ReportsController {
    constructor(monthReportService, productionReportService) {
        this.monthReportService = monthReportService;
        this.productionReportService = productionReportService;
    }
    productionReport(companyId, query) {
        return this.productionReportService.productionReport(companyId, query);
    }
    monthReport(companyId, query) {
        return this.monthReportService.monthReport(companyId, query);
    }
};
exports.ReportsController = ReportsController;
__decorate([
    (0, common_1.Get)('production-report/:companyId'),
    __param(0, (0, common_1.Param)('companyId', new common_1.ParseIntPipe())),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, query_dto_1.ReportQueryDTO]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "productionReport", null);
__decorate([
    (0, common_1.Get)('month-report/:companyId'),
    __param(0, (0, common_1.Param)('companyId', new common_1.ParseIntPipe())),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, query_dto_1.ReportQueryDTO]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "monthReport", null);
exports.ReportsController = ReportsController = __decorate([
    (0, common_1.Controller)('reports'),
    __metadata("design:paramtypes", [month_report_service_1.MonthReportService,
        production_report_service_1.ProductionReportService])
], ReportsController);
//# sourceMappingURL=reports.controller.js.map