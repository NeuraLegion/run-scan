# Run a Bright Scan

This action runs a new security scan in Bright, or reruns an existing one.

### Build Secure Apps & APIs. Fast.

[Bright](https://www.brightsec.com) is a powerful dynamic application & API security testing (DAST) platform that security teams trust and developers love.

### Automatically Tests Every Aspect of Your Apps & APIs

Scans any target, whether Web Apps, APIs (REST. & SOAP, GraphQL & more), Web sockets or mobile, providing actionable reports

### Seamlessly integrates with the Tools and Workflows You Already Use

Bright works with your existing CI/CD pipelines – trigger scans on every commit, pull request or build with unit testing.

### Spin-Up, Configure and Control Scans with Code

One file. One command. One scan. No UI needed.

### Super-Fast Scans

Interacts with applications and APIs, instead of just crawling them and guessing.
Scans are fast as our AI-powered engine can understand application architecture and generate sophisticated and targeted attacks.

### No False Positives

Stop chasing ghosts and wasting time. Bright doesn’t return false positives, so you can focus on releasing code.

### Comprehensive Security Testing

Bright tests for all common vulnerabilities, such as SQL injection, CSRF, XSS, and XXE -- as well as uncommon vulnerabilities, such as business logic vulnerabilities.

More information is available on Bright’s:

- [Website](https://www.brightsec.com/)
- [Knowledge base](https://docs.brightsec.com/docs/quickstart)
- [YouTube channel](https://www.youtube.com/channel/UCoIC0T1pmozq3eKLsUR2uUw)
- [GitHub Actions](https://github.com/marketplace?query=neuralegion+)

# Inputs

### `name`

**Required**. Scan name.

_Example:_ `name: GitHub scan ${{ github.sha }}`

### `api_token`

**Required**. Your Bright API authorization token (key). You can generate it in the **Organization** section in [the Bright app](https://app.neuralegion.com/login). Find more information [here](https://docs.brightsec.com/docs/manage-your-organization#manage-organization-apicli-authentication-tokens).

_Example:_ `api_token: ${{ secrets.NEURALEGION_TOKEN }}`

### `project_id`

Provide project-id if you want to run a scan for a specific project. If you don't provide project-id, scan will run under Default project.

_Example:_ `project_id: gBAh2n9BD9ps7FVQXbLWXv`

### `restart_scan`

**Required** when restarting an existing scan by its ID. You can get the scan ID in the Scans section in [the Bright app](https://app.neuralegion.com/login).

Please make sure to only use the necessary parameters. Otherwise, you will get a response with the parameter usage requirements.

_Example:_ `restart_scan: ai3LG8DmVn9Rn1YeqCNRGQ)`

### `discovery_types`

**Required**. Array of discovery types. The following types are available:

- `archive` - uses an uploaded HAR-file for a scan
- `crawler` - uses a crawler to define the attack surface for a scan
- `oas` - uses an uploaded OpenAPI schema for a scan <br>
  If no discovery type is specified, `crawler` is applied by default.

_Example:_

```yaml
discovery_types: |
  [ "crawler", "archive" ]
```

### `tests`

A list of tests to run during a scan.

_Example:_

```yaml
tests: |
  [ "common_files", "id_enumeration" ]
```

_Recommended tests:_

|                                                                                  |                                                                                                                                              |                              |                                                                                                                                                                                                                                                                                                                                                                                                                              |
| -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Test name**                                                                    | **Description**                                                                                                                              | **Value**                    | **Detectable vulnerabilities**                                                                                                                                                                                                                                                                                                                                                                                               |
| **Amazon S3 Bucket Takeover**                                                    | Tests for S3 buckets that no longer exist to prevent data breaches and malware distribution                                                  | `amazon_s3_takeover`         | - [Amazon S3 Bucket Takeover](https://docs.brightsec.com/docs/amazon-s3-bucket-take-over)                                                                                                                                                                                                                                                                                                                                    |
| **Broken JWT Authentication**                                                    | Tests for secure implementation of JSON Web Token (JWT) in the application                                                                   | `jwt`                        | - [Broken JWT Authentication](https://docs.brightsec.com/docs/broken-jwt-authentication)                                                                                                                                                                                                                                                                                                                                     |                                                     
| **Broken SAML Authentication**                                                   | Tests for secure implementation of SAML authentication in the application                                                                    | `broken_saml_auth`           | - [Broken SAML Authentication](https://docs.brightsec.com/docs/broken-saml-authentication)                                                                                                                                                                                                                                                                                                                                   |
| **Brute Force Login**                                                            | Tests for availability of commonly used credentials                                                                                          | `brute_force_login`          | - [Brute Force Login](https://docs.brightsec.com/docs/brute-force-login)                                                                                                                                                                                                                                                                                                                                                     |
| **Business Constraint Bypass**                                                   | Tests if the limitation of number of retrievable items via an API call is configured properly                                                | `business_constraint_bypass` | - [Business Constraint Bypass](https://docs.brightsec.com/docs/business-constraint-bypass)                                                                                                                                                                                                                                                                                                                                   |
| **Common Files Exposure**                                                        | Tests if common files that should not be accessible are accessible                                                                           | `common_files`               | - [Exposed Common File](https://docs.brightsec.com/docs/exposed-common-file)                                                                                                                                                                                                                                                                                                                                                 |
| **Cookie Security Check**                                                        | Tests if the application uses and implements cookies with secure attributes                                                                  | `cookie_security`            | - [Sensitive Cookie in HTTPS Session Without Secure Attribute](https://docs.brightsec.com/docs/sensitive-cookie-in-https-session-without-secure-attribute)<br> <br> - [Sensitive Cookie Without HttpOnly Flag](https://docs.brightsec.com/docs/sensitive-cookie-without-httponly-flag)<br> <br>- [Sensitive Cookie Weak Session ID](https://docs.brightsec.com/docs/sensitive-cookie-weak-session-id)                        |
| **Cross-Site Request Forgery** <br>_(CSRF)_                                           | Tests application forms for vulnerable cross-site filling and submitting                                                                     | `csrf`                       | - [Unauthorized Cross-Site Request Forgery (CSRF)](https://docs.brightsec.com/docs/unauthorized-cross-site-request-forgery-csrf)<br> <br> - [Authorized Cross-Site Request Forgery (CSRF)](https://docs.brightsec.com/docs/authorized-cross-site-request-forgery-csrf)                                                                                                                                                       |
| **Cross-Site Scripting** <br>_(XSS)_                                                   | Tests if various application parameters are vulnerable to JavaScript injections                                                              | `xss`                        | - [Reflective Cross-Site Scripting (rXSS)](https://docs.brightsec.com/docs/reflective-cross-site-scripting-rxss)                                                                                                                                                                                                                                                                                                                                                 |
| **CSS Injection**                                                   | Tests for weaknesses that could allow hackers to inject malicious Cascading Style Sheets (CSS) code.                                                              | `css_injection`                        | - [CSS Injection Details](https://docs.brightsec.com/docs/css-injection)                                                                                                                                                                                                                                                                                                                                                 |
| **Common Vulnerability Exposure** <br>_(CVE)_                                                    | Tests for known third-party common vulnerability exposures                                                              | `cve_test`                        | - [Common Vulnerability Exposure (CVE) Details](https://docs.brightsec.com/docs/cves)                                                                                                                                                                                                                                                                                                                                                 |
| **Default Login Location**                                                       | Tests if login form location in the target application is easy to guess and accessible                                                       | `default_login_location`     | - [Default Login Location](https://docs.brightsec.com/docs/default-login-location)                                                                                                                                                                                                                                                                                                                                           |
| **Directory Listing**                                                            | Tests if server-side directory listing is possible                                                                                           | `directory_listing`          | - [Directory Listing](https://docs.brightsec.com/docs/directory-listing)                                                                                                                                                                                                                                                                                                                                                     |
| **Email Header Injection**                                                       | Tests if it is possible to send emails to other addresses through the target application mailing server, which can lead to spam and phishing | `email_injection`            | - [Email Header Injection](https://docs.brightsec.com/docs/email-header-injection)                                                                                                                                                                                                                                                                                                                                           |
| **Exposed Database Details** <br>_(Open Database)_                               | Tests if exposed database connection strings are open to public connections                                                                  | `open_database`               | - [Exposed Database Details](https://docs.brightsec.com/docs/open-database)<br> <br> - [Exposed Database Connection String](https://docs.brightsec.com/docs/exposed-database-connection-string)                                                                                                                                                                                                                                                                                                                                                 |
| **Excessive Data Exposure**                               | Tests application for not screening sensitive information on the server side                                                                  | `excessive_data_exposure`               | - [Excessive Data Exposure Details](https://docs.brightsec.com/docs/excessive-data-exposure)                                                                                                                                                                                                                                                                                                                                                 |
| **Full Path Disclosure** <br>_(FPD)_                                                  | Tests if various application parameters are vulnerable to exposure of errors that include full webroot path                                  | `full_path_disclosure`       | - [Full Path Disclosure](https://docs.brightsec.com/docs/full-path-disclosure)                                                                                                                                                                                                                                                                                                                                               |
| **GraphQL Introspection**                                                   | GraphQL data availability test for queries coming from external IP-address                                  | `graphql_introspection`       | - [GraphQL introspection Details](https://docs.brightsec.com/docs/graphql-introspection)                                                                                                                                                                                                                                                                                                                                               |
| **Headers Security Check**                                                       | Tests for proper Security Headers configuration                                                                                              | `header_security`            | - [Misconfigured Security Headers](https://docs.brightsec.com/docs/misconfigured-security-headers)<br> <br> - [Missing Security Headers](https://docs.brightsec.com/docs/missing-security-headers)<br> <br>- [Insecure Content Secure Policy Configuration](https://docs.brightsec.com/docs/insecure-content-secure-policy-configuration)                                                                                                                                                                                                                                                                                                                                                 |
| **HTML Injection**                                                               | Tests if various application parameters are vulnerable to HTML injection                                                                     | `html_injection`             | - [HTML Injection](https://docs.brightsec.com/docs/html-injection)                                                                                                                                                                                                                                                                                                                                                           |
| **iFrame Injection**                                                   | Tests for frame injection attacks evaluate the embedding of deceptive elements on legitimate websites, tricking users into unintended interactions that lead to unauthorized actions, data theft, or malicious activities.        | `iframe_injection`  | - [iFrame Injection Details](https://docs.brightsec.com/docs/iframe-injection)                                                                                                                                                                                                                                                                                                                                   |
| **Improper Assets Management**                                                   | Tests if older or development versions of API endpoints are exposed and can be used to get unauthorized access to data and privileges        | `improper_asset_management`  | - [Improper Assets Management](https://docs.brightsec.com/docs/improper-assets-management)                                                                                                                                                                                                                                                                                                                                   |
| **Insecure HTTP Method** <br>_(HTTP Method Fuzzer)_                              | Tests enumeration of possible HTTP methods for vulnerabilities                                                                               | `http_method_fuzzing`        | - [Insecure HTTP Method](https://docs.brightsec.com/docs/insecure-http-method)                                                                                                                                                                                                                                                                                                                                               |
| **Insecure TLS Configuration**                                                   | Tests SSL/TLS ciphers and configurations for vulnerabilities                                                                                 | `insecure_tls_configuration` | - [Insecure TLS Configuration](https://docs.brightsec.com/docs/insecure-tls-configuration)                                                                                                                                                                                                                                                                                                                                   |
| **Known JavaScript Vulnerabilities** <br>_(JavaScript Vulnerabilities Scanning)_ | Tests for known JavaScript component vulnerabilities                                                                                         | `retire_js`                  | - [JavaScript Component with Known Vulnerabilities](https://docs.brightsec.com/docs/javascript-component-with-known-vulnerabilities)                                                                                                                                                                                                                                                                                         |
| **Known WordPress Vulnerabilities** <br>_(WordPress Scan)_                       | Tests for known WordPress vulnerabilities and tries to enumerate a list of users                                                             | `wordpress`                  | - [WordPress Component with Known Vulnerabilities](https://docs.brightsec.com/docs/wordpress-component-with-known-vulnerabilities)                                                                                                                                                                                                                                                                                           |
| **LDAP Injection**                                                               | Tests if various application parameters are vulnerable to unauthorized LDAP access                                                           | `ldapi`                      | - [LDAP Injection](https://docs.brightsec.com/docs/ldap-injection)<br> <br> - [LDAP Error](https://docs.brightsec.com/docs/ldap-error)                                                                                                                                                                                                                                                                                       |
| **Local File Inclusion** <br>_(LFI)_                                            | Tests if various application parameters are vulnerable to loading of unauthorized local system resources                                     | `lfi`                        | - [Local File Inclusion (LFI)](https://docs.brightsec.com/docs/local-file-inclusion-lfi)                                                                                                                                                                                                                                                                                                                                     |
| **Lack of Resources and Rate Limiting**                                                   | Tests all API endpoints to ensure that rate-limiting or resource exhaustion protection is in place. This test can only be executed as a standalone.                                     | `lrrl`                        | - [Lack of Resources and Rate Limiting Details](https://docs.brightsec.com/docs/lack-of-resources-and-rate-limiting)                                                                                                                                                                                                                                                                                                                                     |
| **Mass Assignment**                                                              | Tests if it is possible to create requests with additional parameters to gain privilege escalation                                           | `mass_assignment`            | - [Mass Assignment](https://docs.brightsec.com/docs/mass-assignment)                                                                                                                                                                                                                                                                                                                                                         |
| **MongoDB Injection**                                                              | Tests parameters for vulnerabilities like unauthorized database access and malicious JavaScript code execution                                           | `nosql`            |                                                                                                                                                                                                                                                                                                   |
| **Open Cloud Storage**                                                         | This test combines assessments for open cloud storage services, including Amazon S3, Azure Blob Storage, and Google Cloud Storage.                                           | `open_cloud_storage`                        | - [Open Cloud Storage Details](https://docs.brightsec.com/docs/open-cloud-storage)                                                                                                                                                                                                                                                                                                                                               |
| **OS Command Injection**                                                         | Tests if various application parameters are vulnerable to Operation System (OS) commands injection                                           | `osi`                        | - [OS Command Injection](https://docs.brightsec.com/docs/os-command-injection)                                                                                                                                                                                                                                                                                                                                               |
| **Prototype Pollution**                                                          | Tests if it is possible to inject properties into existing JavaScript objects                                                                | `proto_pollution`            | - [Prototype Pollution](https://docs.brightsec.com/docs/prototype-pollution)                                                                                                                                                                                                                                                                                                                                                 |
| **Prompt Injection**                                                          | Tests for prompt injections assess the manipulation of LLMs through crafted prompts, which can result in unintended actions and security vulnerabilities like data leaks and unauthorized access.                                                                | `prompt_injection`            | - [Prompt Injection Details](https://docs.brightsec.com/docs/prompt-injection)                                                                                                                                                                                                                                                                                                                                                 |
| **Remote File Inclusion** <br>_(RFI)_                                             | Tests if various application parameters are vulnerable to loading of unauthorized remote system resources                                    | `rfi`                        | - [Remote File Inclusion (RFI)](https://docs.brightsec.com/docs/remote-file-inclusion-rfi)                                                                                                                                                                                                                                                                                                                                   |
| **Secret Tokens Leak**                                                           | Tests for exposure of secret API tokens or keys in the target application                                                                    | `secret_tokens`              | - [Secret Tokens Leak](https://docs.brightsec.com/docs/secret-tokens-leak)                                                                                                                                                                                                                                                                                                                                                   |
| **Server Side Template Injection** <br>_(SSTI)_                                    | Tests if various application parameters are vulnerable to server-side code execution                                                         | `ssti`                       | - [Server Side Template Injection (SSTI)](https://docs.brightsec.com/docs/server-side-template-injection-ssti)                                                                                                                                                                                                                                                                                                               |
| **Server Side Request Forgery** <br>_(SSRF)_                                           | Tests if various application parameters are vulnerable to internal resources access                                                          | `ssrf`                       | - [Server Side Request Forgery (SSRF)](https://docs.brightsec.com/docs/server-side-request-forgery-ssrf)                                                                                                                                                                                                                                                                                                                     |
| **SQL Injection** <br>_(SQLI)_                                                   | SQL Injection tests vulnerable parameters for SQL database access                                                                            | `sqli`                       | - [SQL Injection: Blind Boolean Based](https://docs.brightsec.com/docs/sql-injection-blind-boolean-based)<br> <br> - [SQL Injection: Blind Time Based](https://docs.brightsec.com/docs/sql-injection-blind-time-based)<br> <br> - [SQL Injection](https://docs.brightsec.com/docs/sql-injection)<br> <br> - [SQL Database Error Message in Response](https://docs.brightsec.com/docs/sql-database-error-message-in-response)                                                                                                                                                                                                                                                                                                                                                 |
| **Unrestricted File Upload**                                                     | Tests if file upload mechanisms are validated properly and denies upload of malicious content                                                | `file_upload`                | - [Unrestricted File Upload](https://docs.brightsec.com/docs/unrestricted-file-upload)                                                                                                                                                                                                                                                                                                                                       |
| **Stored Cross-Site Scripting** <br>_(XSS)_                                  | Tests for the presence of multiple XSS vulnerabilities, such as reflective and DOM.                                                                                          | `stored_xss`          | - [Stored Cross-Site Scripting (XSS) Details](https://docs.brightsec.com/docs/stored-cross-site-scripting-pxss)                                                                                                                                                                                                                                                                                                                                                     |
| **Unsafe Date Range** <br>_(Date Manipulation)_                                  | Tests if date ranges are set and validated properly                                                                                          | `date_manipulation`          | - [Unsafe Date Range](https://docs.brightsec.com/docs/unsafe-date-range)                                                                                                                                                                                                                                                                                                                                                     |
| **Known JavaScript Vulnerabilities** <br>_(JavaScript Vulnerabilities Scanning)_                                  | Tests for known JavaScript component vulnerabilities                                                                                          | `server_side_js_injection`          | - [JavaScript Component with Known Vulnerabilities Details](https://docs.brightsec.com/docs/javascript-component-with-known-vulnerabilities)                                                                                                                                                                                                                                                                                                                                                     |
| **Unsafe Redirect** <br>_(Unvalidated Redirect)_                                 | Tests if various application parameters are vulnerable to injection of a malicious link which can redirect a user without validation         | `unvalidated_redirect`       | - [Unsafe Redirect](https://docs.brightsec.com/docs/unsafe-redirect)                                                                                                                                                                                                                                                                                                                                                         |
| **User ID Enumeration**                                                          | Tests if it is possible to collect valid user ID data by interacting with the target application                                             | `id_enumeration`             | - [Enumerable Integer-Based ID](https://docs.brightsec.com/docs/enumerable-integer-based-id)                                                                                                                                                                                                                                                                                                                                                 |
| **Version Control System Data Leak**                                             | Tests if it is possible to access Version Control System (VCS) resources                                                                     | `version_control_systems`    | - [Version Control System Data Leak](https://docs.brightsec.com/docs/version-control-system-data-leak)                                                                                                                                                                                                                                                                                                                                                 |
| **XML External Entity Injection**                                                | Tests if various XML parameters are vulnerable to XML parsing of unauthorized external entities                                              | `xxe`                        | - [XML External Entity Injection](https://docs.brightsec.com/docs/xml-external-entity-injection)                                                                                                                                                                                                                                                                                                                                                 |
| **XPath Injection**                                                | Tests if unvalidated user input in XPath expressions can be exploited to manipulate queries, potentially leading to unauthorized access or unintended actions                                              | `xpathi`                        | - [XPath Injection Details](https://docs.brightsec.com/docs/xpath-injection)                                                                                                                                                                                                                                                                                                                                                 |

### `file_id`

**Required** if the discovery type is set to `archive` or `oas`. ID of a HAR-file or an OpenAPI schema you want to use for a scan. You can get the ID of an uploaded HAR-file or an OpenAPI schema in the **Storage** section on [app.neuralegion.com](https://app.neuralegion.com/login).

_Example:_

```
FILE_ID=$(nexploit-cli archive:upload   \
--token ${{ secrets.NEURALEGION_TOKEN }}   \
--discard true                          \
./example.har)
```

### `crawler_urls`

**Required** if the discovery type is set to `crawler`. Target URLs to be used by the crawler to define the attack surface.

_Example:_

```yaml
crawler_urls: |
  [ "http://vulnerable-bank.com" ]
```

### `hosts_filter`

**Required** when the the discovery type is set to `archive`. Allows selecting specific hosts for a scan.

### `exclude_params`

A list of regex patterns for parameter names you would like to ignore during the tests.

_Example:_

```yaml
exclude_params: |
  [ "userId", "orgId" ]
```

### `exclude_entry_points`

A list of JSON strings that contain patterns for entry points you would like to ignore during the tests.

_Example:_

```yaml
exclude_entry_points: |
  [ { "methods": [ "POST" ], "patterns": [ "users\/.+\/?$" ] } ]
```

To remove default exclusions pass an empty array as follows:

_Example:_

```yaml
exclude_entry_points: |
  []
```

To apply patterns for all HTTP methods, you can set an empty array to `methods`:

```yaml
exclude_entry_points: |
  [ { "methods": [], "patterns": [ "users\/.+\/?$" ] } ]
```

## Outputs

### `url`

Url of the resulting scan

### `id`

ID of the created scan. This ID could then be used to restart the scan, or for the following GitHub actions:

- [Bright Wait for Issues](https://github.com/marketplace/actions/nexploit-wait-for-issues)
- [Bright Stop Scan](https://github.com/marketplace/actions/nexploit-stop-scan)

## Example usage

### Start a new scan with parameters

```yaml
steps:
  - name: Start NeuraLegion Scan
    id: start
    uses: NeuraLegion/run-scan@v1.1
    with:
      api_token: ${{ secrets.NEURALEGION_TOKEN }}
      name: GitHub scan ${{ github.sha }}
      discovery_types: |
        [ "crawler", "archive" ]
      crawler_urls: |
        [ "http://vulnerable-bank.com" ]
      file_id: LiYknMYSdbSZbqgMaC9Sj
  - name: Get the output scan url
    run: echo "The scan was started on ${{ steps.start.outputs.url }}"
```

#### Restart an existing scan

```yaml
steps:
  - name: Start NeuraLegion Scan
    id: start
    uses: NeuraLegion/run-scan@v1.1
    with:
      api_token: ${{ secrets.NEURALEGION_TOKEN }}
      name: GitHub scan ${{ github.sha }}
      restart_scan: ai3LG8DmVn9Rn1YeqCNRGQ
  - name: Get the output scan url
    run: echo "The scan was started on ${{ steps.start.outputs.url }}"
```
