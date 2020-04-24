import * as core from '@actions/core';
import * as github from '@actions/github';
import * as https from 'https';

//const crawlerUrls = core.getDelimitedInput('crawler_urls', ',');
//var crawlerUrls = crawlerUrls.length == 0 ? null : crawlerUrls;
//const module = core.getInput('module');
//const hostsFilter = core.getDelimitedInput('hosts_filter');
//const type = core.getInput('type');
//const protocol = core.getInput('protocol');
//const name = core.getInput('name');

/*
const data = JSON.stringify({
    name: name,
    protocol: protocol,
    type: type,
    discoveryTypes: discoveryTypes,
    fileId: fileId,
    hostsFilter: hostsFilter,
    module: module,
    crawlerUrls: crawlerUrls
});

const options = {
    hostname: hostname,
    path: '/api/v1/scans',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        'Authorization': `Api-Key ${apiToken}`
    }
};

const req = https.request(options, (res) => {
    console.log('statusCode:', res.statusCode);

    if (res.statusCode == 201 || res.statusCode == 200) {
        console.log('Scan started');
        core.setOutput('Scan started');
    } else {
        res.on('data', (d) => {
            core.setFailed(d);
        });
    }
});

req.on('error', (e) => {
    core.setFailed(e.message);
});
req.write(data);
req.end();
    }
    catch (err) {
        core.setFailed(err.message);
}
*/

try {
    
    const apiToken = core.getInput('api_token');
    const hostname = core.getInput('hostname');
    const fileId = core.getInput('file_id');
    const discoveryTypes = JSON.parse(core.getInput('discovery_types'));

    console.log(`Hello ${apiToken}!`);
    console.log(`discoveryTypes: ${discoveryTypes}!`);
    const time = (new Date()).toTimeString();
    core.setOutput("time", time);
    const payload = JSON.stringify(github.context.payload, undefined, 2)
    console.log(`The event payload: ${payload}`);
} catch (error) {
    core.setFailed(error.message);
}
