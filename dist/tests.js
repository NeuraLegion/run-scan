"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTests = exports.hasExclusiveTests = exports.hasExpensiveTests = exports.isValidTest = exports.exclusiveTests = exports.expensiveTests = exports.TestType = void 0;
const core = __importStar(require("@actions/core"));
var TestType;
(function (TestType) {
    TestType["DOM_XSS"] = "dom_xss";
    TestType["AMAZON_S3_TAKEOVER"] = "amazon_s3_takeover";
    TestType["BROKEN_OBJECT_PROPERTY_AUTHORIZATION"] = "bopla";
    TestType["BROKEN_ACCESS_CONTROL"] = "broken_access_control";
    TestType["BROKEN_SAML_AUTH"] = "broken_saml_auth";
    TestType["BRUTE_FORCE_LOGIN"] = "brute_force_login";
    TestType["BUSINESS_CONSTRAINT_BYPASS"] = "business_constraint_bypass";
    TestType["COMMON_FILES"] = "common_files";
    TestType["COOKIE_SECURITY"] = "cookie_security";
    TestType["CSRF"] = "csrf";
    TestType["CSS_INJECTION"] = "css_injection";
    TestType["CVE"] = "cve_test";
    TestType["DATE_MANIPULATION"] = "date_manipulation";
    TestType["DEFAULT_LOGIN_LOCATION"] = "default_login_location";
    TestType["DIRECTORY_LISTING"] = "directory_listing";
    TestType["EMAIL_INJECTION"] = "email_injection";
    TestType["EXCESSIVE_DATA_EXPOSURE"] = "excessive_data_exposure";
    TestType["FILE_UPLOAD"] = "file_upload";
    TestType["FULL_PATH_DISCLOSURE"] = "full_path_disclosure";
    TestType["GRAPHQL_INTROSPECTION"] = "graphql_introspection";
    TestType["HEADER_SECURITY"] = "header_security";
    TestType["HTML_INJECTION"] = "html_injection";
    TestType["HTTP_METHOD_FUZZING"] = "http_method_fuzzing";
    TestType["ID_ENUMERATION"] = "id_enumeration";
    TestType["IFRAME_INJECTION"] = "iframe_injection";
    TestType["IMPROPER_ASSET_MANAGEMENT"] = "improper_asset_management";
    TestType["INSECURE_OUPUT_HANDLING"] = "insecure_output_handling";
    TestType["INSECURE_TLS_CONFIGURATION"] = "insecure_tls_configuration";
    TestType["JWT"] = "jwt";
    TestType["LDAPI"] = "ldapi";
    TestType["LFI"] = "lfi";
    TestType["LRRL"] = "lrrl";
    TestType["NOSQL"] = "nosql";
    TestType["OPEN_CLOUD_STORAGE"] = "open_cloud_storage";
    TestType["OPEN_DATABASE"] = "open_database";
    TestType["OSI"] = "osi";
    TestType["PROMPT_INJECTION"] = "prompt_injection";
    TestType["PROTO_POLLUTION"] = "proto_pollution";
    TestType["RETIRE_JS"] = "retire_js";
    TestType["RFI"] = "rfi";
    TestType["SECRET_TOKENS"] = "secret_tokens";
    TestType["SERVER_SIDE_JS_INJECTION"] = "server_side_js_injection";
    TestType["SQLI"] = "sqli";
    TestType["SSRF"] = "ssrf";
    TestType["SSTI"] = "ssti";
    TestType["STORED_XSS"] = "stored_xss";
    TestType["UNVALIDATED_REDIRECT"] = "unvalidated_redirect";
    TestType["VERSION_CONTROL_SYSTEMS"] = "version_control_systems";
    TestType["WORDPRESS"] = "wordpress";
    TestType["XPATHI"] = "xpathi";
    TestType["XSS"] = "xss";
    TestType["XXE"] = "xxe";
})(TestType = exports.TestType || (exports.TestType = {}));
exports.expensiveTests = [
    TestType.BUSINESS_CONSTRAINT_BYPASS,
    TestType.CVE,
    TestType.DATE_MANIPULATION,
    TestType.EXCESSIVE_DATA_EXPOSURE,
    TestType.ID_ENUMERATION,
    TestType.LRRL,
    TestType.RETIRE_JS
];
exports.exclusiveTests = [TestType.LRRL];
const isValidTest = (test) => Object.values(TestType).includes(test);
exports.isValidTest = isValidTest;
const hasExpensiveTests = (tests) => tests.some(x => exports.expensiveTests.includes(x));
exports.hasExpensiveTests = hasExpensiveTests;
const hasExclusiveTests = (tests) => tests.some(x => exports.exclusiveTests.includes(x)) && tests.length !== 1;
exports.hasExclusiveTests = hasExclusiveTests;
const validateTests = (uniqueTests) => {
    const invalidTests = uniqueTests.filter(x => !(0, exports.isValidTest)(x));
    if (invalidTests.length) {
        throw new Error(`${invalidTests.join(', ')} tests are invalid. Please re-configure the scan.`);
    }
    if ((0, exports.hasExclusiveTests)(uniqueTests)) {
        const chosenTests = uniqueTests.filter(x => exports.exclusiveTests.includes(x));
        throw new Error(`${chosenTests.join(', ')} tests are mutually exclusive with other tests. Please re-configure the scan.`);
    }
    if ((0, exports.hasExpensiveTests)(uniqueTests)) {
        const chosenTests = uniqueTests.filter(x => exports.expensiveTests.includes(x));
        const warningMessage = `${chosenTests.join(', ')} tests are expensive. Please use them with caution.`;
        core.warning(warningMessage);
    }
};
exports.validateTests = validateTests;
