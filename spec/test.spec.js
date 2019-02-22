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
    const SecretId = process.env.COS_SECRET_ID;
    const SecretKey = process.env.COS_SECRET_KEY;
    const Bucket = process.env.COS_BUCKET;
    const Region = process.env.COS_REGION;
    const DirectAccess = true;
    const Signed = true;
    const filename = 'test.jpg';
    const param = {
      SecretId,
      SecretKey,
      Bucket,
      Region,
      DirectAccess,
      Signed
    };
    const cosAdapter = new COSAdapter(param);
    filesAdapterTests.testAdapter("COSAdapter", cosAdapter);

    it('should not throw error of getting signed url', () => {
      // test getFileLocation API
      // get signed url
      const cosAdapterSigned = new COSAdapter(param);
      const fileLocation = cosAdapterSigned.getFileLocation({}, filename);
      const regSignedUrl = new RegExp(`^https://${Bucket}.cos.${Region}.myqcloud.com/${filename}\?.+$`);
      expect(fileLocation).toMatch(regSignedUrl);
    });

    it('should not throw error of getting unsigned url', () => {
      // get unsigned url
      param.Signed = false;
      const cosAdapterNotSigned = new COSAdapter(param);
      const fileLocation = cosAdapterNotSigned.getFileLocation({}, filename);
      const strUnsignedUrl = `https://${Bucket}.cos.${Region}.myqcloud.com/${filename}`;
      expect(fileLocation).toBe(strUnsignedUrl);
    });

    it('should not throw error of getting file path through parse-server', () => {
      // get file path through parse-server
      param.DirectAccess = false;
      const cosAdapterNotDirectAccess = new COSAdapter(param);
      const mount = '/assets';
      const appId = 'testApp';
      const fileLocation = cosAdapterNotDirectAccess.getFileLocation({
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
