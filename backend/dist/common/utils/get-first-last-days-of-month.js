"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFirstAndLastDaysOfMonth = getFirstAndLastDaysOfMonth;
function getFirstAndLastDaysOfMonth(dateString) {
    if (dateString) {
        const [year, month] = dateString.split('-');
        return {
            firstMonthDay: new Date(+year, +month - 1, 1),
            lastMonthDay: new Date(+year, +month, 0),
        };
    }
    else {
        const today = new Date();
        return {
            firstMonthDay: new Date(today.getFullYear(), today.getMonth(), 1),
            lastMonthDay: new Date(today.getFullYear(), today.getMonth() + 1, 0),
        };
    }
}
//# sourceMappingURL=get-first-last-days-of-month.js.map