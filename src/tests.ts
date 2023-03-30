import * as core from '@actions/core';

export enum TestType {
  ANGULAR_CSTI = 'angular_csti',
  BACKUP_LOCATIONS = 'backup_locations',
  BROKEN_SAML_AUTH = 'broken_saml_auth',
  BRUTE_FORCE_LOGIN = 'brute_force_login',
  BUSINESS_CONSTRAINT_BYPASS = 'business_constraint_bypass',
  COMMON_FILES = 'common_files',
  COOKIE_SECURITY = 'cookie_security',
  CSRF = 'csrf',
  CVE = 'cve_test',
  DATE_MANIPULATION = 'date_manipulation',
  DEFAULT_LOGIN_LOCATION = 'default_login_location',
  DIRECTORY_LISTING = 'directory_listing',
  DOM_XSS = 'dom_xss',
  EMAIL_INJECTION = 'email_injection',
  EXCESSIVE_DATA_EXPOSURE = 'excessive_data_exposure',
  EXPOSED_COUCH_DB_APIS = 'exposed_couch_db_apis',
  FILE_UPLOAD = 'file_upload',
  FULL_PATH_DISCLOSURE = 'full_path_disclosure',
  GRAPHQL_INTROSPECTION = 'graphql_introspection',
  HEADER_SECURITY = 'header_security',
  HRS = 'hrs',
  HTML_INJECTION = 'html_injection',
  HTTP_METHOD_FUZZING = 'http_method_fuzzing',
  HTTP_RESPONSE_SPLITTING = 'http_response_splitting',
  ID_ENUMERATION = 'id_enumeration',
  IMPROPER_ASSET_MANAGEMENT = 'improper_asset_management',
  INSECURE_TLS_CONFIGURATION = 'insecure_tls_configuration',
  JWT = 'jwt',
  LDAPI = 'ldapi',
  LFI = 'lfi',
  LRRL = 'lrrl',
  MASS_ASSIGNMENT = 'mass_assignment',
  NOSQL = 'nosql',
  OPEN_BUCKETS = 'open_buckets',
  OPEN_DATABASE = 'open_database',
  OSI = 'osi',
  PROTO_POLLUTION = 'proto_pollution',
  RETIRE_JS = 'retire_js',
  RFI = 'rfi',
  S3_TAKEOVER = 'amazon_s3_takeover',
  SECRET_TOKENS = 'secret_tokens',
  SERVER_SIDE_JS_INJECTION = 'server_side_js_injection',
  SQLI = 'sqli',
  SSRF = 'ssrf',
  SSTI = 'ssti',
  UNVALIDATED_REDIRECT = 'unvalidated_redirect',
  VERSION_CONTROL_SYSTEMS = 'version_control_systems',
  WEBDAV = 'webdav',
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
  TestType.MASS_ASSIGNMENT,
  TestType.RETIRE_JS,
  // not implemented yet by the engine
  TestType.ANGULAR_CSTI,
  TestType.BACKUP_LOCATIONS,
  TestType.EXPOSED_COUCH_DB_APIS,
  TestType.HTTP_RESPONSE_SPLITTING,
  TestType.HRS
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
