"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateConnectivityStatuses = exports.validateEntryPointsStatuses = exports.Connectivity = exports.EntryPointStatus = void 0;
var EntryPointStatus;
(function (EntryPointStatus) {
    EntryPointStatus["NEW"] = "new";
    EntryPointStatus["CHANGED"] = "changed";
    EntryPointStatus["TESTED"] = "tested";
    EntryPointStatus["VULNERABLE"] = "vulnerable";
})(EntryPointStatus = exports.EntryPointStatus || (exports.EntryPointStatus = {}));
var Connectivity;
(function (Connectivity) {
    Connectivity["OK"] = "ok";
    Connectivity["PROBLEM"] = "problem";
    Connectivity["UNAUTHORIZED"] = "unauthorized";
    Connectivity["UNREACHABLE"] = "unreachable";
})(Connectivity = exports.Connectivity || (exports.Connectivity = {}));
const isValidStatus = (status) => Object.values(EntryPointStatus).includes(status);
const isValidConnectivity = (status) => Object.values(Connectivity).includes(status);
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
const validateConnectivityStatuses = (statuses) => {
    const invalidStatuses = statuses.filter(x => !isValidConnectivity(x));
    if (invalidStatuses.length) {
        throw new Error(`Invalid entrypoint_connectivity_statuses value(s): ${invalidStatuses.join(', ')}. Valid values are: ${Object.values(Connectivity).join(', ')}`);
    }
    const uniqueStatuses = new Set(statuses);
    if (uniqueStatuses.size !== statuses.length) {
        throw new Error('Entrypoint connectivity statuses contain duplicate values.');
    }
};
exports.validateConnectivityStatuses = validateConnectivityStatuses;
