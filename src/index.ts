import * as core from "@actions/core";
import * as rm from "typed-rest-client/RestClient";

const apiToken = core.getInput("api_token");
const restartScanID = core.getInput("restart_scan");
const name = core.getInput("name");
const fileId = core.getInput("file_id");
const crawlerUrls = getArray("crawler_urls");
const discoveryTypes_in = getArray("discovery_types");
const module_in = core.getInput("module");
const hostsFilter = getArray("hosts_filter");
const type = core.getInput("type");
const hostname = core.getInput("hostname");

function getArray(name: string): string[] | undefined {
  const input = core.getInput(name);

  try {
    const elements = JSON.parse(input);

    if (elements instanceof Array) {
      return elements.length == 0 ? undefined : elements;
    } else {
      return undefined;
    }
  } catch (err) {
    core.debug(name + ` failed: ${err}` + " => " + input);
    return undefined;
  }
}

const baseUrl = hostname ? `https://$hostname` : "https://nexploit.app";
let restc: rm.RestClient = new rm.RestClient("GitHub Actions", baseUrl);

interface Scan {
  id: string;
}

async function retest(token: string, uuid: string, name?: string) {
  let scan_name = name || "GitHub Actions";

  try {
    let options = { additionalHeaders: { Authorization: `Api-Key ${token}` } };
    let restRes: rm.IRestResponse<Scan> = await restc.create<Scan>(
      `api/v1/scans/${uuid}/retest`,
      { name: scan_name },
      options
    );

    switch (restRes.statusCode) {
      case 201: {
        let url = `https://nexploit.app/scans/${restRes.result?.id}`;
        console.log(`Success. Scan was created on ${url}`);
        core.setOutput("url", url);
        return;
      }
      case 400: {
        core.setFailed("Failed to run scan");
        return;
      }
      case 401: {
        core.setFailed("Failed to log in with provided credentials");
        return;
      }
      case 403: {
        core.setFailed(
          "The account doesn't have any permissions for a resource"
        );
        return;
      }
    }
  } catch (err) {
    core.setFailed(`Failed run retest: ${err}`);
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
    console.debug(scan);
    let options = { additionalHeaders: { Authorization: `Api-Key ${token}` } };
    restRes = await restc.create<Scan>(
      "api/v1/scans/",
      scan,
      options
    );

    if (restRes.statusCode < 300) {
      let id = restRes.result!.id;
      let url = `https://nexploit.app/scans/${id}`;
      console.log(`Success. Scan was created on ${url}`);
      core.setOutput("url", url);
      core.setOutput("id", id);
    } else {
      core.setFailed(`Failed create scan. Status code: ${restRes.statusCode}`);
    }
  } catch (err: any) {
    if ('statusCode' in err) {
      switch (err.statusCode) {
        case 400: {
          core.setFailed(`Failed to run scan: ${err.message}`);
          return;
        }
        case 401: {
          core.setFailed(`Failed to log in with provided credentials: ${err.message}`);
          return;
        }
        case 403: {
          core.setFailed(
            `The account doesn't have any permissions for a resource: ${err.message}`
          );
          return;
        }
        default: {
          core.setFailed(`Failed create scan: ${err.message}`);
        }
      }
    }
  }
}

if (restartScanID) {
  if (
    !(
      fileId ||
      crawlerUrls ||
      discoveryTypes_in ||
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
  const module = module_in || "dast";
  const discoveryTypes = discoveryTypes_in || ["archive"];

  create(apiToken, {
    name,
    discoveryTypes,
    module,
    crawlerUrls,
    fileId,
    hostsFilter,
  });
}
