'use strict';
let filesAdapterTests = require('parse-server-conformance-tests').files;

let COSAdapter = require('../index.js');

describe('COSAdapter tests', () => {
  if (
    process.env.COS_SECRET_ID
    && process.env.COS_SECRET_KEY
    && process.env.COS_BUCKET
    && process.env.COS_REGION
  ) {
    // Should be initialized from the env
    let cosAdapter = new COSAdapter();
    filesAdapterTests.testAdapter("COSAdapter", cosAdapter);
  }

  delete process.env.COS_SECRET_ID;
  delete process.env.COS_SECRET_KEY;
  delete process.env.COS_BUCKET;
  delete process.env.COS_REGION;

  it('should throw when not initialized properly', () => {
    expect(() => {
      return new COSAdapter('');
    }).toThrow('COSAdapter requires an SecretId');

    expect(() => {
      return new COSAdapter('SecretId');
    }).toThrow('COSAdapter requires an SecretKey');

    expect(() => {
      return new COSAdapter('SecretId', 'SecretKey');
    }).toThrow('COSAdapter requires an Region');

    expect(() => {
      return new COSAdapter('SecretId', 'SecretKey', 'Region');
    }).toThrow('COSAdapter requires an Bucket');

    expect(() => {
      return new COSAdapter({ SecretId: 'SecretId'});
    }).toThrow('COSAdapter requires an SecretKey');

    expect(() => {
      return new COSAdapter({ SecretId: 'SecretId' , SecretKey: 'SecretKey'});
    }).toThrow('COSAdapter requires an Region');

    expect(() => {
      return new COSAdapter({ SecretId: 'SecretId' , SecretKey: 'SecretKey', Region: 'Region'});
    }).toThrow('COSAdapter requires an Bucket');
  });

  it('should not throw when initialized properly', () => {
    expect(() => {
      return new COSAdapter('SecretId', 'SecretKey', 'Region', 'Bucket');
    }).not.toThrow();

    expect(() => {
      return new COSAdapter({ SecretId: 'SecretId' , SecretKey: 'SecretKey', Region: 'Region', Bucket: 'Bucket'});
    }).not.toThrow();
  });
});
