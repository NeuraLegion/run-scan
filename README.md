# Nexploit Scan Runner 1

This action runs a new scan in Nexploit, or reruns an existing one.

## Inputs

### `api_token`

**Required** Api Token. You can generate it in *Organization* section

### `restart_scan`

Scan ID to restart.

### `file_id`

HAR-file ID.

### `discovery_types`

Array of discovery types. Can be: archive, crawler, oas.

Example:

```yml
discovery_types: |
  [ "crawler", "archive" ]
```

### `crawler_urls`

Crawler URLs

Example:

```yml
crawler_urls: |
  [ "http://vulnerable-bank.com" ]
```

### `module`

Possible values: *core*, *exploratory*

### `hosts_filter`

Hosts filter

### `name`

Scan name.

Example: ```name: GitHub scan ${{ github.sha }}```

## Outputs

### `url`

Url of the resulting scan

## Example usage

Start a new scan with parameters

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

Restart an existing scan

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
