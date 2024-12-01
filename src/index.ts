import { TestType } from './tests';
import { Discovery } from './discovery';
import { Config, RequestExclusion, validateConfig } from './config';
import { HttpClient } from '@actions/http-client';
import * as core from '@actions/core';

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

const apiToken = core.getInput('api_token', { required: true });
const restartScanID = core.getInput('restart_scan');
const name = core.getInput('name');
const fileId = core.getInput('file_id');
const projectId = core.getInput('project_id');
const crawlerUrls = getArray('crawler_urls');
const excludedParams = getArray('exclude_params');
const excludedEntryPoints = getArray<RequestExclusion>('exclude_entry_points');
const tests = getArray<TestType>('tests');
const discoveryTypesIn = getArray<Discovery>('discovery_types');
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

const create = async (config: Config) => {
  try {
    const response = await client.postJson<Scan>(
      `${baseUrl}/api/v1/scans`,
      config
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
      projectId ||
      crawlerUrls ||
      discoveryTypesIn ||
      module_in ||
      hostsFilter ||
      type ||
      tests
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
    ? [Discovery.ARCHIVE]
    : discoveryTypesIn;
  const uniqueTests = tests ? [...new Set(tests)] : undefined;
  const config: Config = {
    name,
    discoveryTypes,
    module,
    ...(crawlerUrls ? { crawlerUrls } : {}),
    ...(fileId ? { fileId } : {}),
    ...(projectId ? { projectId } : {}),
    ...(uniqueTests?.length ? { tests: uniqueTests } : {}),
    ...(hostsFilter?.length ? { hostsFilter } : {}),
    ...(excludedEntryPoints?.length || excludedParams?.length
      ? {
          exclusions: {
            requests: excludedEntryPoints,
            params: excludedParams
          }
        }
      : {})
  };

  try {
    validateConfig(config);
  } catch (e: any) {
    core.setFailed(e.message);
    throw e;
  }

  create(config);
}
