import * as core from '@actions/core';

export enum TestType {
  DOM_XSS = 'dom_xss',
  AMAZON_S3_TAKEOVER = 'amazon_s3_takeover',
  BROKEN_OBJECT_PROPERTY_AUTHORIZATION = 'bopla',
  BROKEN_ACCESS_CONTROL = 'broken_access_control',
  BROKEN_SAML_AUTH = 'broken_saml_auth',
  BRUTE_FORCE_LOGIN = 'brute_force_login',
  BUSINESS_CONSTRAINT_BYPASS = 'business_constraint_bypass',
  COMMON_FILES = 'common_files',
  COOKIE_SECURITY = 'cookie_security',
  CSRF = 'csrf',
  CSS_INJECTION = 'css_injection',
  CVE = 'cve_test',
  DATE_MANIPULATION = 'date_manipulation',
  DEFAULT_LOGIN_LOCATION = 'default_login_location',
  DIRECTORY_LISTING = 'directory_listing',
  EMAIL_INJECTION = 'email_injection',
  EXCESSIVE_DATA_EXPOSURE = 'excessive_data_exposure',
  FILE_UPLOAD = 'file_upload',
  FULL_PATH_DISCLOSURE = 'full_path_disclosure',
  GRAPHQL_INTROSPECTION = 'graphql_introspection',
  HEADER_SECURITY = 'header_security',
  HTML_INJECTION = 'html_injection',
  HTTP_METHOD_FUZZING = 'http_method_fuzzing',
  ID_ENUMERATION = 'id_enumeration',
  IFRAME_INJECTION = 'iframe_injection',
  IMPROPER_ASSET_MANAGEMENT = 'improper_asset_management',
  INSECURE_OUPUT_HANDLING = 'insecure_output_handling',
  INSECURE_TLS_CONFIGURATION = 'insecure_tls_configuration',
  JWT = 'jwt',
  LDAPI = 'ldapi',
  LFI = 'lfi',
  LRRL = 'lrrl',
  NOSQL = 'nosql',
  OPEN_CLOUD_STORAGE = 'open_cloud_storage',
  OPEN_DATABASE = 'open_database',
  OSI = 'osi',
  PROMPT_INJECTION = 'prompt_injection',
  PROTO_POLLUTION = 'proto_pollution',
  RETIRE_JS = 'retire_js',
  RFI = 'rfi',
  SECRET_TOKENS = 'secret_tokens',
  SERVER_SIDE_JS_INJECTION = 'server_side_js_injection',
  SQLI = 'sqli',
  SSRF = 'ssrf',
  SSTI = 'ssti',
  STORED_XSS = 'stored_xss',
  UNVALIDATED_REDIRECT = 'unvalidated_redirect',
  VERSION_CONTROL_SYSTEMS = 'version_control_systems',
  WORDPRESS = 'wordpress',
  XPATHI = 'xpathi',
  XSS = 'xss',
  XXE = 'xxe'
}

export const expensiveTests: readonly TestType[] = [
  TestType.BUSINESS_CONSTRAINT_BYPASS,
  TestType.CVE,
  TestType.DATE_MANIPULATION,
  TestType.EXCESSIVE_DATA_EXPOSURE,
  TestType.ID_ENUMERATION,
  TestType.LRRL,
  TestType.RETIRE_JS
];

export const exclusiveTests: readonly TestType[] = [TestType.LRRL];

export const isValidTest = (test: TestType) =>
  Object.values(TestType).includes(test);

export const hasExpensiveTests = (tests: TestType[]) =>
  tests.some(x => expensiveTests.includes(x));

export const hasExclusiveTests = (tests: TestType[]) =>
  tests.some(x => exclusiveTests.includes(x)) && tests.length !== 1;

export const validateTests = (uniqueTests: TestType[]): void => {
  const invalidTests = uniqueTests.filter(x => !isValidTest(x));

  if (invalidTests.length) {
    throw new Error(
      `${invalidTests.join(
        ', '
      )} tests are invalid. Please re-configure the scan.`
    );
  }

  if (hasExclusiveTests(uniqueTests)) {
    const chosenTests = uniqueTests.filter(x => exclusiveTests.includes(x));
    throw new Error(
      `${chosenTests.join(
        ', '
      )} tests are mutually exclusive with other tests. Please re-configure the scan.`
    );
  }

  if (hasExpensiveTests(uniqueTests)) {
    const chosenTests = uniqueTests.filter(x => expensiveTests.includes(x));
    const warningMessage = `${chosenTests.join(
      ', '
    )} tests are expensive. Please use them with caution.`;
    core.warning(warningMessage);
  }
};
