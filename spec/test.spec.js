'use strict';
let filesAdapterTests = require('parse-server-conformance-tests').files;

let COSAdapter = require('../index.js');

describe('COSAdapter tests', () => {
  if (
    process.env.COS_SECRET_ID
    && process.env.COS_SECRET_KEY
    && process.env.COS_BUCKET
    && process.env.COS_REGION
    && process.env.COS_DIRECT_ACCESS
    && process.env.COS_SIGNED
  ) {
    // Should be initialized from the env
    let cosAdapter = new COSAdapter();
    filesAdapterTests.testAdapter("COSAdapter", cosAdapter);

    it('should not throw error of getFileLocation method', () => {
      const SecretId = process.env.COS_SECRET_ID;
      const SecretKey = process.env.COS_SECRET_KEY;
      const Bucket = process.env.COS_BUCKET;
      const Region = process.env.COS_REGION;
      const DirectAccess = process.env.COS_DIRECT_ACCESS;
      const Signed = process.env.COS_SIGNED;
      const param = {
        SecretId,
        SecretKey,
        Bucket,
        Region,
        DirectAccess,
        Signed
      };

      // test getFileLocation API
      // get signed url
      const cosAdapterSigned = new COSAdapter(param);
      const filename = 'test.jpg';
      let fileLocation = cosAdapterSigned.getFileLocation({}, filename);
      const regSignedUrl = new RegExp(`^https://${process.env.COS_BUCKET}.cos.${process.env.COS_REGION}.myqcloud.com/${filename}\?.+$`);
      expect(fileLocation).toMatch(regSignedUrl);
      // get unsigned url
      delete param.Signed;
      const cosAdapterNotSigned = new COSAdapter(param);
      fileLocation = cosAdapterNotSigned.getFileLocation({}, filename);
      const strUnsignedUrl = `https://${process.env.COS_BUCKET}.cos.${process.env.COS_REGION}.myqcloud.com/${filename}`;
      expect(fileLocation).toBe(strUnsignedUrl);
      // get file path through parse-server
      delete param.DirectAccess;
      const cosAdapterNotDirectAccess = new COSAdapter(param);
      const mount = '/assets';
      const appId = 'testApp';
      fileLocation = cosAdapterNotDirectAccess.getFileLocation({
        mount: mount,
        applicationId: appId
      }, filename);
      expect(fileLocation).toBe(`${mount}/files/${appId}/${filename}`);
    });
  }

  delete process.env.COS_SECRET_ID;
  delete process.env.COS_SECRET_KEY;
  delete process.env.COS_BUCKET;
  delete process.env.COS_REGION;
  delete process.env.COS_SIGNED;
  delete process.env.COS_DIRECT_ACCESS;

  it('should throw when not initialized properly', () => {
    expect(() => {
      return new COSAdapter();
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
