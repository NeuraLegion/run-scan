"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateConfig = exports.isValidUrl = void 0;
const discovery_1 = require("./discovery");
const entrypoints_1 = require("./entrypoints");
const tests_1 = require("./tests");
const url_1 = require("url");
const invalidUrlProtocols = new Set([
    'javascript:',
    'file:',
    'data:',
    'mailto:',
    'ftp:',
    'blob:',
    'about:',
    'ssh:',
    'tel:',
    'view-source:',
    'ws:',
    'wss:'
]);
const isValidUrl = (url) => {
    try {
        const { protocol } = new url_1.URL(url);
        return !invalidUrlProtocols.has(protocol);
    }
    catch (_a) {
        return false;
    }
};
exports.isValidUrl = isValidUrl;
function validateCrawlerUrls(crawlerUrls, discoveryTypes = []) {
    if (crawlerUrls) {
        if (!discoveryTypes.includes(discovery_1.Discovery.CRAWLER)) {
            throw new Error(`Invalid discovery. When specifying a crawler URLs, the discovery type must be "crawler". The current discovery types are: ${discoveryTypes.join(', ')}`);
        }
        if (!crawlerUrls.length) {
            throw new Error('No crawler URLs configured.');
        }
    }
    else {
        if (discoveryTypes.includes(discovery_1.Discovery.CRAWLER)) {
            throw new Error(`Invalid discovery. When setting a discovery type to either "crawler", the crawler URLs must be provided.`);
        }
    }
}
function validateFileId(fileId, discoveryTypes = []) {
    if (fileId) {
        if (!(discoveryTypes.includes(discovery_1.Discovery.OAS) ||
            discoveryTypes.includes(discovery_1.Discovery.ARCHIVE) ||
            discoveryTypes.includes(discovery_1.Discovery.GRAPHQL))) {
            throw new Error(`Invalid discovery. When specifying a file ID, the discovery type must be either "oas" or "archive" or "graphql". The current discovery types are: ${discoveryTypes.join(', ')}`);
        }
    }
    else {
        if (discoveryTypes.includes(discovery_1.Discovery.OAS) ||
            discoveryTypes.includes(discovery_1.Discovery.ARCHIVE) ||
            discoveryTypes.includes(discovery_1.Discovery.GRAPHQL)) {
            throw new Error(`Invalid discovery. When setting a discovery type to either "oas" or "archive" or "graphql", the file ID must be provided.`);
        }
    }
}
function validateEntryPointFilters(entryPointIds, entryPointsStatuses, entryPointFilter, projectId) {
    var _a, _b;
    if ((entryPointIds === null || entryPointIds === void 0 ? void 0 : entryPointIds.length) &&
        ((entryPointsStatuses === null || entryPointsStatuses === void 0 ? void 0 : entryPointsStatuses.length) || entryPointFilter)) {
        throw new Error('The "entrypoints" and "entrypoints_statuses" are mutually exclusive and cannot be used together.');
    }
    if (entryPointsStatuses === null || entryPointsStatuses === void 0 ? void 0 : entryPointsStatuses.length) {
        if (!projectId) {
            throw new Error('The "project_id" must be provided when using "entrypoints_statuses".');
        }
        (0, entrypoints_1.validateEntryPointsStatuses)(entryPointsStatuses);
    }
    if (entryPointFilter) {
        if (!projectId) {
            throw new Error('The "project_id" must be provided when using "entrypoints_statuses" and "entrypoint_connectivity_statuses".');
        }
        if (!((_a = entryPointFilter.securityStatus) === null || _a === void 0 ? void 0 : _a.length)) {
            throw new Error('The "entrypoints_statuses" must be provided when using "entrypoint_connectivity_statuses".');
        }
        (0, entrypoints_1.validateEntryPointsStatuses)(entryPointFilter.securityStatus);
        if ((_b = entryPointFilter.connectivityStatus) === null || _b === void 0 ? void 0 : _b.length) {
            (0, entrypoints_1.validateConnectivityStatuses)(entryPointFilter.connectivityStatus);
        }
    }
}
const validateConfig = ({ fileId, crawlerUrls, discoveryTypes, tests, entryPointIds, entryPointsStatuses, entryPointFilter, projectId }) => {
    if (!(entryPointIds === null || entryPointIds === void 0 ? void 0 : entryPointIds.length) &&
        !(entryPointsStatuses === null || entryPointsStatuses === void 0 ? void 0 : entryPointsStatuses.length) &&
        !entryPointFilter) {
        // validate discovery only if no entry point IDs or statuses are provided
        (0, discovery_1.validateDiscovery)(discoveryTypes || []);
        validateFileId(fileId, discoveryTypes || []);
        validateCrawlerUrls(crawlerUrls, discoveryTypes || []);
    }
    validateEntryPointFilters(entryPointIds, entryPointsStatuses, entryPointFilter, projectId);
    if (tests) {
        (0, tests_1.validateTests)(tests);
    }
};
exports.validateConfig = validateConfig;
