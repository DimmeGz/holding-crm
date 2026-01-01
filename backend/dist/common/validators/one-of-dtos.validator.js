"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsOneOfDtosConstraint = void 0;
const class_validator_1 = require("class-validator");
const class_validator_2 = require("class-validator");
const class_transformer_1 = require("class-transformer");
let IsOneOfDtosConstraint = class IsOneOfDtosConstraint {
    validate(values, args) {
        const dtoClasses = args.constraints;
        for (const value of values) {
            let isOk = false;
            for (const DtoClass of dtoClasses) {
                const instance = (0, class_transformer_1.plainToInstance)(DtoClass, value);
                const errors = (0, class_validator_2.validateSync)(instance);
                if (errors.length === 0) {
                    isOk = true;
                    break;
                }
            }
            if (!isOk)
                return false;
        }
        return true;
    }
    defaultMessage(args) {
        const dtoNames = args.constraints
            .map((dto) => dto.name)
            .join(', ');
        return `Value does not match any of the allowed DTOs: ${dtoNames}`;
    }
};
exports.IsOneOfDtosConstraint = IsOneOfDtosConstraint;
exports.IsOneOfDtosConstraint = IsOneOfDtosConstraint = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'IsOneOfDtos', async: false })
], IsOneOfDtosConstraint);
//# sourceMappingURL=one-of-dtos.validator.js.map