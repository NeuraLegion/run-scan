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

**Required**. Your Bright API authorization token (key). You can generate it in the **Organization** section in [the Bright app](https://app.brightsec.com/login). Find more information [here](https://docs.brightsec.com/docs/manage-your-organization#manage-organization-apicli-authentication-tokens).

_Example:_ `api_token: ${{ secrets.BRIGHT_TOKEN }}`

### `project_id`

Provide project-id if you want to run a scan for a specific project. If you don't provide project-id, scan will run under Default project.

_Example:_ `project_id: gBAh2n9BD9ps7FVQXbLWXv`

### `restart_scan`

**Required** when restarting an existing scan by its ID. You can get the scan ID in the Scans section in [the Bright app](https://app.brightsec.com/login).

Please make sure to only use the necessary parameters. Otherwise, you will get a response with the parameter usage requirements.

_Example:_ `restart_scan: ai3LG8DmVn9Rn1YeqCNRGQ)`

### `discovery_types`

**Required**. Array of discovery types. The following types are available:

- `archive` - uses an uploaded HAR-file for a scan
- `crawler` - uses a crawler to define the attack surface for a scan
- `oas` - uses an uploaded OpenAPI schema for a scan
- `graphql` - uses an uploaded OpenAPI schema, or an introspection endpoint <br>
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

Please see the attached [vulnerability guide](https://docs.brightsec.com/docs/vulnerability-guide) for a full and updated list of available tests.

### `file_id`

**Required** if the discovery type is set to `archive` or `oas` or `graphql`. ID of a HAR-file or an OpenAPI schema you want to use for a scan. You can get the ID of an uploaded HAR-file or an OpenAPI schema in the **Storage** section on [app.brightsec.com](https://app.brightsec.com/login).

_Example:_

```
FILE_ID=$(nexploit-cli archive:upload   \
--token ${{ secrets.BRIGHT_TOKEN }}   \
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

### `entrypoints`

A list of entry point ids to be included in the scan.

_Example:_

```yaml
entrypoints: |
  [ "550e8400-e29b-41d4-a716-446655440000", "7c9e6679-7425-40de-944b-e07fc1f90ae7" ]
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
  - name: Bright Security Scan
    id: start
    uses: NeuraLegion/bright-github-actions/run-scan@release
    with:
      api_token: ${{ secrets.BRIGHT_TOKEN }}
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
  - name: Bright Security Scan
    id: start
    uses: NeuraLegion/bright-github-actions/run-scan@release
    with:
      api_token: ${{ secrets.BRIGHT_TOKEN }}
      name: GitHub scan ${{ github.sha }}
      restart_scan: ai3LG8DmVn9Rn1YeqCNRGQ
  - name: Get the output scan url
    run: echo "The scan was started on ${{ steps.start.outputs.url }}"
```
