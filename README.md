# Run a Nexploit Scan

This action runs a new security scan in Nexploit, or reruns an existing one.

## About NeuraLegion's Nexploit 

NeuraLegion’s NexPloit is a Dynamic Application Security Testing (DAST) solution powered by Artificial Intelligence (AI) and modern scanning technologies. With its effective automation and integration capabilities, Nexploit allows developers to scan multiple targets, uncover security vulnerabilities without false positives, get detailed reports on every finding,  and quickly fix security issues by following the remediation guidelines. 

Nexploit is built to solve the core security tasks of your applications and APIs:
* 👾 Finding Vulnerabilities (Issues) – As well as finding OWASP Top 10  technical issues (and much more) in your applications, NexPloit’s AI Engine automatically detects unknown Zero-Day and Business-Logic Flow issues, reducing lengthy and costly manual testing, as well as providing False Positive Free reporting and remediation guidelines. 
* 🚀 Security Testing Automation – Nexploit enables seamless integration into your Software Development Life Cycle (SDLC). As the only solution that has automated Zero-Day detection, our False Positive Free reports are generated in real-time, with pinpoint code instrumentation, empowering your DevOps to the highest security standards, without losing development speed or agility. 
* 🔐 Security Standard Compliance – Nexploit provides you with a comprehensive scanning flow which simplifies your compliance validation process and provides instant reports on identified issues that accelerate your confirmation process. Nexploit enables you to firmly comply with the standards of OWASP Top 10 technical issues, ISO/IEC 27001, PCI DSS, CWE/SANS, and more.

More information is available on NeuraLegion’s:
* [Website](https://www.neuralegion.com/)
* [Knowledge base](https://kb.neuralegion.com/#/guide/np-web-ui/scanning)
* [YouTube channel](https://www.youtube.com/channel/UCoIC0T1pmozq3eKLsUR2uUw)
* [GitHub Actions](https://github.com/marketplace?query=neuralegion+)

Improve your app security by integrating NexPloit into your CI pipeline - trigger scans on every commit, pull request or build with unit testing.

## Inputs

### `name`

**Required**. Scan name.

_Example:_ ```name: GitHub scan ${{ github.sha }}```

### `api_token`

**Required**. Your Nexploit API authorization token (key). You can generate it in the **Organization** section on [nexploit.app](https://nexploit.app/login). Find more information [here](https://kb.neuralegion.com/#/guide/np-web-ui/advanced-set-up/managing-org?id=managing-organization-apicli-authentication-tokens).

_Example:_ `--token ${{ secrets.NEXPLOIT_TOKEN }})`

### `restart_scan`

**Required**. ID of an existing scan to be restarted. You can get the scan ID in the Scans section on [nexploit.app](https://nexploit.app/login).

_Example:_ `restart_scan: ai3LG8DmVn9Rn1YeqCNRGQ)`

### `discovery_types`

**Required**. Array of discovery types. The following types are available:
* `archive` - uses an uploaded HAR-file for a scan
* `crawler` - uses a crawler to define the attack surface for a scan
* `oas` - uses an uploaded OpenAPI schema for a scan

_Example:_

```yml
discovery_types: |
  [ "crawler", "archive" ]
```

### `file_id`

**Required**. ID of a HAR-file you want to use for a scan.  You can get the ID of an uploaded HAR-file in the **Storage** section on [nexploit.app](https://nexploit.app/login).

_Example:_

```
FILE_ID=$(nexploit-cli archive:upload   \
--token ${{ secrets.NEXPLOIT_TOKEN }}   \
--discard true                          \
./example.har)
```

### `crawler_urls`

**Required**. Target URLs to be used by the crawler to define the attack surface.

_Example:_

```
crawler_urls: |
  [ "http://vulnerable-bank.com" ]
```

### `hosts_filter`

**Optional**. Allows selecting specific hosts for a scan. 

## Outputs

### `url`

Url of the resulting scan

## Usage Example

### Start a new scan with parameters

```yml
steps:
    - name: Start Nexploit Scan
      id: start
      uses: NeuraLegion/run-scan@v0.2
      with:
        api_token: ${{ secrets.NEXPLOIT_TOKEN }}
        name: GitHub scan ${{ github.sha }}
        discovery_types: |
          [ "crawler", "archive" ]
        crawler_urls: |
          [ "http://vulnerable-bank.com" ]
        file_id: LiYknMYSdbSZbqgMaC9Sj
        hosts_filter: |
          [ ]
    - name: Get the output scan url
      run: echo "The scan was started on ${{ steps.start.outputs.url }}"
```

#### Restart an existing scan

```yml
steps:
    - name: Start Nexploit Scan
      id: start
      uses: NeuraLegion/run-scan@v0.2
      with:
        api_token: ${{ secrets.NEXPLOIT_TOKEN }}
        name: GitHub scan ${{ github.sha }}
        restart_scan: ai3LG8DmVn9Rn1YeqCNRGQ
    - name: Get the output scan url
      run: echo "The scan was started on ${{ steps.start.outputs.url }}"
```
