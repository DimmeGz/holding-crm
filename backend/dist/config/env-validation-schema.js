"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VALIDATION_SCHEMA = void 0;
const Joi = require("joi");
exports.VALIDATION_SCHEMA = Joi.object({
    PORT: Joi.number().port().default(3000),
});
//# sourceMappingURL=env-validation-schema.js.map