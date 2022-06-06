import * as core from '@actions/core';
import { HttpClient } from '@actions/http-client';

interface RequestExclusion {
  patterns: string[];
  methods: string[];
}

interface Exclusions {
  params?: string[];
  requests?: RequestExclusion[];
}

interface NewScan {
  name: string;
  discoveryTypes: string[];
  exclusions?: Exclusions;
  module?: string;
  crawlerUrls?: string[];
  fileId?: string;
  hostsFilter?: string[];
}

interface Scan {
  id: string;
}

const getArray = <T = string>(inputName: string): T[] | undefined => {
  const input = core.getInput(inputName);

  try {
    const elements = JSON.parse(input);

    return elements instanceof Array ? elements : undefined;
  } catch (err) {
    core.debug(inputName + ` failed: ${err}` + ' => ' + input);
  }
};

const apiToken = core.getInput('api_token');
const restartScanID = core.getInput('restart_scan');
const name = core.getInput('name');
const fileId = core.getInput('file_id');
const crawlerUrls = getArray('crawler_urls');
const excludedParams = getArray('exclude_params');
const excludedEntryPoints = getArray<RequestExclusion>('exclude_entry_points');
const discoveryTypesIn = getArray('discovery_types');
const module_in = core.getInput('module');
const hostsFilter = getArray('hosts_filter');
const type = core.getInput('type');
const hostname = core.getInput('hostname');

const baseUrl = hostname
  ? `https://${hostname}`
  : 'https://app.neuralegion.com';

const client = new HttpClient('GitHub Actions', [], {
  allowRetries: true,
  maxRetries: 5,
  headers: { authorization: `Api-Key ${apiToken}` }
});

const retest = async (uuid: string, scanName?: string) => {
  try {
    const response = await client.postJson<Scan>(
      `${baseUrl}/api/v1/scans/${uuid}/retest`,
      { name: scanName || 'GitHub Actions' }
    );

    if (response.statusCode < 300 && response.result) {
      const { result } = response;
      const url = `${baseUrl}/scans/${result.id}`;

      core.setOutput('url', url);
      core.setOutput('id', result.id);
    } else {
      core.setFailed(`Failed retest. Status code: ${response.statusCode}`);
    }
  } catch (err: any) {
    core.setFailed(`Failed (${err.statusCode}) ${err.message}`);
  }
};

const create = async (scan: NewScan) => {
  try {
    const response = await client.postJson<Scan>(
      `${baseUrl}/api/v1/scans`,
      scan
    );

    if (response.statusCode < 300 && response.result) {
      const { result } = response;
      const url = `${baseUrl}/scans/${result.id}`;

      core.setOutput('url', url);
      core.setOutput('id', result.id);
    } else {
      core.setFailed(`Failed create scan. Status code: ${response.statusCode}`);
    }
  } catch (err: any) {
    core.setFailed(`Failed (${err.statusCode}) ${err.message}`);
  }
};

if (restartScanID) {
  if (
    !(
      fileId ||
      crawlerUrls ||
      discoveryTypesIn ||
      module_in ||
      hostsFilter ||
      type
    )
  ) {
    retest(restartScanID, name);
  } else {
    core.setFailed(
      "You don't need parameters, other than api_token, restart_scan and name, if you just want to restart an existing scan"
    );
  }
} else {
  const module = module_in || 'dast';
  const discoveryTypes = !discoveryTypesIn?.length
    ? ['archive']
    : discoveryTypesIn;

  create({
    name,
    discoveryTypes,
    module,
    crawlerUrls,
    fileId,
    hostsFilter,
    exclusions: {
      requests: excludedEntryPoints,
      params: excludedParams
    }
  });
}
