import { Discovery, validateDiscovery } from './discovery';
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

export interface Config {
  name: string;
  discoveryTypes: Discovery[];
  exclusions?: Exclusions;
  module?: string;
  crawlerUrls?: string[];
  fileId?: string;
  projectId?: string;
  hostsFilter?: string[];
  tests?: TestType[];
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
  discoveryTypes: Discovery[]
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
  discoveryTypes: Discovery[]
) {
  if (fileId) {
    if (
      !(
        discoveryTypes.includes(Discovery.OAS) ||
        discoveryTypes.includes(Discovery.ARCHIVE)
      )
    ) {
      throw new Error(
        `Invalid discovery. When specifying a file ID, the discovery type must be either "oas" or "archive". The current discovery types are: ${discoveryTypes.join(
          ', '
        )}`
      );
    }
  } else {
    if (
      discoveryTypes.includes(Discovery.OAS) ||
      discoveryTypes.includes(Discovery.ARCHIVE)
    ) {
      throw new Error(
        `Invalid discovery. When setting a discovery type to either "oas" or "archive", the file ID must be provided.`
      );
    }
  }
}

export const validateConfig = ({
  fileId,
  crawlerUrls,
  discoveryTypes,
  tests
}: Config) => {
  validateDiscovery(discoveryTypes);

  validateFileId(fileId, discoveryTypes);

  validateCrawlerUrls(crawlerUrls, discoveryTypes);

  if (tests) {
    validateTests(tests);
  }
};
