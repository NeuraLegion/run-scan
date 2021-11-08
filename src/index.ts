import * as core from '@actions/core';
import * as rm from 'typed-rest-client/RestClient';

const apiToken = core.getInput('api_token');
const restartScanID = core.getInput('restart_scan');
const name = core.getInput('name');
const fileId = core.getInput('file_id');
const crawlerUrls = getArray('crawler_urls');
const discoveryTypesIn = getArray('discovery_types');
const module_in = core.getInput('module');
const hostsFilter = getArray('hosts_filter');
const type = core.getInput('type');
const hostname = core.getInput('hostname');

function getArray(inputName: string): string[] | undefined {
  const input = core.getInput(inputName);

  try {
    const elements = JSON.parse(input);

    if (elements instanceof Array) {
      return elements.length ? elements : undefined;
    } else {
      return undefined;
    }
  } catch (err) {
    core.debug(inputName + ` failed: ${err}` + ' => ' + input);

    return undefined;
  }
}

const baseUrl = hostname ? `https://${hostname}` : 'https://app.neuralegion.com';

const restc: rm.RestClient = new rm.RestClient('GitHub Actions', baseUrl);

interface Scan {
  id: string;
}

async function retest(token: string, uuid: string, scanName?: string) {
  try {
    const options = {
      additionalHeaders: { Authorization: `Api-Key ${token}` }
    };
    const restRes: rm.IRestResponse<Scan> = await restc.create<Scan>(
      `api/v1/scans/${uuid}/retest`,
      { name: scanName || 'GitHub Actions' },
      options
    );

    if (restRes.statusCode < 300 && restRes.result) {
      const url = `${baseUrl}/scans/${restRes.result.id}`;
      core.setOutput('url', url);
      core.setOutput('id', restRes.result.id);
    } else {
      core.setFailed(`Failed retest. Status code: ${restRes.statusCode}`);
    }
  } catch (err: any) {
    core.setFailed(`Failed (${err.statusCode}) ${err.message}`);
  }
}

interface NewScan {
  name: string;
  discoveryTypes: string[];
  module?: string;
  crawlerUrls?: string[];
  fileId?: string;
  hostsFilter?: string[];
}

async function create(token: string, scan: NewScan) {
  let restRes: rm.IRestResponse<Scan>;
  try {
    const options = {
      additionalHeaders: { Authorization: `Api-Key ${token}` }
    };
    restRes = await restc.create<Scan>('api/v1/scans/', scan, options);

    if (restRes.result && restRes.statusCode < 300) {
      const id = restRes.result.id;
      const url = `${baseUrl}/scans/${id}`;
      core.setOutput('url', url);
      core.setOutput('id', id);
    } else {
      core.setFailed(`Failed create scan. Status code: ${restRes.statusCode}`);
    }
  } catch (err: any) {
    core.setFailed(`Failed (${err.statusCode}) ${err.message}`);
  }
}

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
    retest(apiToken, restartScanID, name);
  } else {
    core.setFailed(
      "You don't need parameters, other than api_token, restart_scan and name, if you just want to restart an existing scan"
    );
  }
} else {
  const module = module_in || 'dast';
  const discoveryTypes = discoveryTypesIn || ['archive'];

  create(apiToken, {
    name,
    discoveryTypes,
    module,
    crawlerUrls,
    fileId,
    hostsFilter
  });
}
