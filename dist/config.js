"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateConfig = exports.isValidUrl = void 0;
const discovery_1 = require("./discovery");
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
function validateCrawlerUrls(crawlerUrls, discoveryTypes) {
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
function validateFileId(fileId, discoveryTypes) {
    if (fileId) {
        if (!(discoveryTypes.includes(discovery_1.Discovery.OAS) ||
            discoveryTypes.includes(discovery_1.Discovery.ARCHIVE))) {
            throw new Error(`Invalid discovery. When specifying a file ID, the discovery type must be either "oas" or "archive". The current discovery types are: ${discoveryTypes.join(', ')}`);
        }
    }
    else {
        if (discoveryTypes.includes(discovery_1.Discovery.OAS) ||
            discoveryTypes.includes(discovery_1.Discovery.ARCHIVE)) {
            throw new Error(`Invalid discovery. When setting a discovery type to either "oas" or "archive", the file ID must be provided.`);
        }
    }
}
const validateConfig = ({ fileId, crawlerUrls, discoveryTypes, tests }) => {
    (0, discovery_1.validateDiscovery)(discoveryTypes);
    validateFileId(fileId, discoveryTypes);
    validateCrawlerUrls(crawlerUrls, discoveryTypes);
    if (tests) {
        (0, tests_1.validateTests)(tests);
    }
};
exports.validateConfig = validateConfig;
