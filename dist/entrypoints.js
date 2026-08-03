"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEntryPointsStatuses = exports.EntryPointStatus = void 0;
var EntryPointStatus;
(function (EntryPointStatus) {
    EntryPointStatus["NEW"] = "new";
    EntryPointStatus["CHANGED"] = "changed";
    EntryPointStatus["TESTED"] = "tested";
    EntryPointStatus["VULNERABLE"] = "vulnerable";
})(EntryPointStatus = exports.EntryPointStatus || (exports.EntryPointStatus = {}));
const isValidStatus = (status) => Object.values(EntryPointStatus).includes(status);
const validateEntryPointsStatuses = (statuses) => {
    const invalidStatuses = statuses.filter(x => !isValidStatus(x));
    if (invalidStatuses.length) {
        throw new Error(`Invalid entrypoints_statuses value(s): ${invalidStatuses.join(', ')}. Valid values are: ${Object.values(EntryPointStatus).join(', ')}`);
    }
    const uniqueStatuses = new Set(statuses);
    if (uniqueStatuses.size !== statuses.length) {
        throw new Error('Entrypoint statuses contain duplicate values.');
    }
};
exports.validateEntryPointsStatuses = validateEntryPointsStatuses;
