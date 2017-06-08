#!/usr/bin/env node

var fs = require('fs');
var cli = require('commander');
var got = require('got');
var OAuth   = require('oauth-1.0a');
var crypto  = require('crypto');

var oauthFile = 'oauth';
if (!fs.existsSync(oauthFile)) {
    console.log('Error: oauth file not found in script root folder!');
    process.exit(1);
}
var oauthCredentials = JSON.parse(fs.readFileSync(oauthFile, 'utf-8'));

const serviceDomain = 'http://localhost:8080';
const serviceEndpoint = '/api/account/v1/users/userAttributes';
const payload = [
  {
    "key": "customer_segment",
    "values": ["20"]
  }
];

const oauth = OAuth({
	consumer: {
		key: oauthCredentials.client_id,
		secret: oauthCredentials.client_secret
	},
	signature_method: 'HMAC-SHA1',
	hash_function: (baseString, key) => crypto.createHmac('sha1', key).update(baseString).digest('base64')
});

cli.arguments('<file>')
    .action(function(file) {
        updateCustomerSegment(readLines(file));
    })
    .parse(process.argv);

function updateCustomerSegment(companyUUIDList) {
    var timeout = 500;
    var ctd = 0;
    companyUUIDList.forEach(function(uuid) {
        setTimeout(function() {
            doRequest(uuid);
        }, timeout);
        timeout += 500;
        ctd += 1;
    });
    console.log("Total requests: "+ctd)
}

function readLines(file) {
    if (!fs.existsSync(file)) {
        console.log('Error: '+file+' file not found!');
        process.exit(1);
    }
    return fs
        .readFileSync(file, 'utf-8')
        .split('\n')
        .filter(Boolean);
}

function doRequest(companyUUID) {
    var requestUrl = serviceDomain+serviceEndpoint+'?companyId='+companyUUID

    var request_data = {
        url: requestUrl,
        method: 'PUT',
    };
    header = oauth.toHeader(oauth.authorize(request_data));
    header['Content-type'] = 'application/json';

    const options = {
        headers: header,
        body : JSON.stringify(payload)
    }

    got.put(requestUrl, options)
        .then(response => {
            console.log('Company %s (%d: %s)', companyUUID, response.statusCode, response.statusMessage);
        })
        .catch(err => {
            console.log('Error: uuid: %s (%d: %s)', companyUUID, err.response.statusCode, err.response.statusMessage);
        });
}
