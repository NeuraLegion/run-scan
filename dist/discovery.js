"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDiscovery = exports.Discovery = void 0;
var Discovery;
(function (Discovery) {
    Discovery["ARCHIVE"] = "archive";
    Discovery["CRAWLER"] = "crawler";
    Discovery["OAS"] = "oas";
})(Discovery = exports.Discovery || (exports.Discovery = {}));
const validateDiscovery = (discoveryTypes) => {
    if (discoveryTypes.some((x) => !isValidDiscovery(x))) {
        throw new Error('Unknown discovery type supplied.');
    }
    const uniqueDiscoveryTypes = new Set(discoveryTypes);
    if (uniqueDiscoveryTypes.size !== discoveryTypes.length) {
        throw new Error('Discovery contains duplicate values.');
    }
    if (uniqueDiscoveryTypes.size !== 1) {
        disallowDiscoveryCombination(uniqueDiscoveryTypes);
    }
};
exports.validateDiscovery = validateDiscovery;
const isValidDiscovery = (x) => Object.values(Discovery).includes(x);
const disallowDiscoveryCombination = (discoveryTypes) => {
    const disallowedCombinations = getDisallowedDiscoveryCombination([
        ...discoveryTypes
    ]);
    if (disallowedCombinations.length) {
        const [firstInvalidCombination] = disallowedCombinations;
        throw new Error(`The discovery list cannot include both ${firstInvalidCombination === null || firstInvalidCombination === void 0 ? void 0 : firstInvalidCombination[0]} and any of ${firstInvalidCombination === null || firstInvalidCombination === void 0 ? void 0 : firstInvalidCombination[1].join(', ')} simultaneously.`);
    }
};
const disallowedDiscoveryCombinations = new Map([
    [Discovery.OAS, [Discovery.CRAWLER, Discovery.ARCHIVE]]
]);
const getDisallowedDiscoveryCombination = (discoveryTypes) => [...disallowedDiscoveryCombinations].filter(([x]) => discoveryTypes.includes(x));
