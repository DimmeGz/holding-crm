"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VALIDATION_SCHEMA = void 0;
const Joi = require("joi");
exports.VALIDATION_SCHEMA = Joi.object({
    BACKEND_PORT: Joi.number().port().default(3000),
    DB_HOST: Joi.string(),
    DB_PORT: Joi.number().port().default(5432),
    DB_USERNAME: Joi.string(),
    DB_PASSWORD: Joi.string(),
    DB_NAME: Joi.string(),
});
//# sourceMappingURL=env-validation-schema.js.map