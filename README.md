# parse-server-cos-adapter
Tecent Cloud COS(file storage) adapter for parse-server

[![Greenkeeper badge](https://badges.greenkeeper.io/forefront-ux/parse-server-cos-adapter.svg)](https://greenkeeper.io/)
[![Build
Status](https://travis-ci.org/forefront-ux/parse-server-cos-adapter.svg?branch=master)](https://travis-ci.org/forefront-ux/parse-server-cos-adapter)
[![codecov.io](https://codecov.io/github/forefront-ux/parse-server-cos-adapter/coverage.svg?branch=master)](https://codecov.io/github/forefront-ux/parse-server-cos-adapter?branch=master)
[![NPM Version](https://img.shields.io/npm/v/@forefront/parse-server-cos-adapter.svg?style=flat-square)](https://www.npmjs.com/package/@forefront/parse-server-cos-adapter)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)


parse-server adapter for Tecent COS

# installation

`npm install --save @forefront/parse-server-cos-adapter`

# usage with parse-server

### using a config file

```
{
  "appId": 'my_app_id',
  "masterKey": 'my_master_key',
  // other options
  "filesAdapter": {
    "module": "@forefront/parse-server-cos-adapter",
    "options": {
      "SecretId": "SecretId",
      "SecretKey": "SecretKey",
      "Region": "my_region",
      "Bucket": "my_bucket",
      // optional:
      "directAccess": false // default value
    }
  }
}
```

### using environment variables

Set your environment variables:

```
COS_SECRET_ID=SecretId
COS_SECRET_KEY=SecretKey
COS_REGION=regionName
COS_BUCKET=bucketName
```

And update your config / options

```
{
  "appId": 'my_app_id',
  "masterKey": 'my_master_key',
  // other options
  "filesAdapter": "@forefront/parse-server-cos-adapter"
}
```

### passing as an instance

```
var COSAdapter = require('@forefront/parse-server-cos-adapter');

var cosAdapter = new COSAdapter('SecretId',
  'SecretKey',
  'Region',
  'Bucket' , {
    directAccess: false
  }
);

var api = new ParseServer({
  appId: 'my_app',
  masterKey: 'master_key',
  filesAdapter: cosAdapter
})
```

or with an options hash

```
var COSAdapter = require('@forefront/parse-server-cos-adapter');

var cosOptions = {
  "SecretId": "SecretId",
  "SecretKey": "SecretKey",
  "Region": "my_region",
  "Bucket": "my_bucket",
  "DirectAccess": false
}

var cosAdapter = new COSAdapter(cosOptions);

var api = new ParseServer({
  appId: 'my_app',
  masterKey: 'master_key',
  filesAdapter: cosAdapter
})
```
