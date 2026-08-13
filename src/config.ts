import { Discovery, validateDiscovery } from './discovery';
import {
  Connectivity,
  EntryPointStatus,
  validateConnectivityStatuses,
  validateEntryPointsStatuses
} from './entrypoints';
import { TestType, validateTests } from './tests';
import { URL } from 'url';

export interface RequestExclusion {
  patterns?: string[];
  methods?: string[];
}

export interface Exclusions {
  params?: string[];
  requests?: RequestExclusion[];
}

export interface EntryPointFilter {
  securityStatus: EntryPointStatus[];
  connectivityStatus?: Connectivity[];
}

export interface Config {
  name: string;
  discoveryTypes?: Discovery[];
  exclusions?: Exclusions;
  module?: string;
  crawlerUrls?: string[];
  fileId?: string;
  authObjectId?: string;
  repeaters?: string[];
  projectId?: string;
  hostsFilter?: string[];
  tests?: TestType[];
  entryPointIds?: string[];
  entryPointsStatuses?: EntryPointStatus[];
  entryPointFilter?: EntryPointFilter;
}

const invalidUrlProtocols: ReadonlySet<string> = new Set<string>([
  'javascript:',
  'file:',
  'data:',
  'mailto:',
  'ftp:',
  'blob:',
  'about:',
  'ssh:',
  'tel:',
  'view-source:',
  'ws:',
  'wss:'
]);

export const isValidUrl = (url: string) => {
  try {
    const { protocol } = new URL(url);

    return !invalidUrlProtocols.has(protocol);
  } catch {
    return false;
  }
};

function validateCrawlerUrls(
  crawlerUrls: string[] | undefined,
  discoveryTypes: Discovery[] = []
) {
  if (crawlerUrls) {
    if (!discoveryTypes.includes(Discovery.CRAWLER)) {
      throw new Error(
        `Invalid discovery. When specifying a crawler URLs, the discovery type must be "crawler". The current discovery types are: ${discoveryTypes.join(
          ', '
        )}`
      );
    }

    if (!crawlerUrls.length) {
      throw new Error('No crawler URLs configured.');
    }
  } else {
    if (discoveryTypes.includes(Discovery.CRAWLER)) {
      throw new Error(
        `Invalid discovery. When setting a discovery type to either "crawler", the crawler URLs must be provided.`
      );
    }
  }
}

function validateFileId(
  fileId: string | undefined,
  discoveryTypes: Discovery[] = []
) {
  if (fileId) {
    if (
      !(
        discoveryTypes.includes(Discovery.OAS) ||
        discoveryTypes.includes(Discovery.ARCHIVE) ||
        discoveryTypes.includes(Discovery.GRAPHQL)
      )
    ) {
      throw new Error(
        `Invalid discovery. When specifying a file ID, the discovery type must be either "oas" or "archive" or "graphql". The current discovery types are: ${discoveryTypes.join(
          ', '
        )}`
      );
    }
  } else {
    if (
      discoveryTypes.includes(Discovery.OAS) ||
      discoveryTypes.includes(Discovery.ARCHIVE) ||
      discoveryTypes.includes(Discovery.GRAPHQL)
    ) {
      throw new Error(
        `Invalid discovery. When setting a discovery type to either "oas" or "archive" or "graphql", the file ID must be provided.`
      );
    }
  }
}

function validateEntryPointFilters(
  entryPointsStatuses: EntryPointStatus[] | undefined,
  entryPointFilter: EntryPointFilter | undefined,
  projectId: string | undefined
) {
  if (entryPointsStatuses?.length) {
    if (!projectId) {
      throw new Error(
        'The "project_id" must be provided when using "entrypoints_statuses".'
      );
    }

    validateEntryPointsStatuses(entryPointsStatuses);
  }

  if (entryPointFilter) {
    if (!projectId) {
      throw new Error(
        'The "project_id" must be provided when using "entrypoints_statuses" and "entrypoint_connectivity_statuses".'
      );
    }

    if (!entryPointFilter.securityStatus?.length) {
      throw new Error(
        'The "entrypoints_statuses" must be provided when using "entrypoint_connectivity_statuses".'
      );
    }

    validateEntryPointsStatuses(entryPointFilter.securityStatus);

    if (entryPointFilter.connectivityStatus?.length) {
      validateConnectivityStatuses(entryPointFilter.connectivityStatus);
    }
  }
}

export const validateConfig = ({
  fileId,
  crawlerUrls,
  discoveryTypes,
  tests,
  entryPointIds,
  entryPointsStatuses,
  entryPointFilter,
  projectId
}: Config) => {
  if (
    !entryPointIds?.length &&
    !entryPointsStatuses?.length &&
    !entryPointFilter
  ) {
    // validate discovery only if no entry point IDs or statuses are provided
    validateDiscovery(discoveryTypes || []);
    validateFileId(fileId, discoveryTypes || []);
    validateCrawlerUrls(crawlerUrls, discoveryTypes || []);
  }

  validateEntryPointFilters(entryPointsStatuses, entryPointFilter, projectId);

  if (tests) {
    validateTests(tests);
  }
};
