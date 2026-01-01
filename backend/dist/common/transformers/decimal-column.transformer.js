"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecimalColumnTransformer = void 0;
class DecimalColumnTransformer {
    to(data) {
        return data;
    }
    from(data) {
        return parseFloat(data);
    }
}
exports.DecimalColumnTransformer = DecimalColumnTransformer;
//# sourceMappingURL=decimal-column.transformer.js.map