"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsOneOfDtos = IsOneOfDtos;
const class_validator_1 = require("class-validator");
const validators_1 = require("../validators");
function IsOneOfDtos(...dtoClasses) {
    return (0, class_validator_1.Validate)(validators_1.IsOneOfDtosConstraint, dtoClasses);
}
//# sourceMappingURL=is-one-of-dtos.decorator.js.map