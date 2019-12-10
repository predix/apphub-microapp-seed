require('dotenv').config();
const { expect } = require('chai');
const dotenv = require('../../../src/server/common/env');

const mockVcapServices = JSON.stringify({
  'predix-uaa': [
    {
      credentials: {
        dashboardUrl:
          'https://uaa-dashboard.run.aws-usw02-dev.ice.predix.io/#/login/45ae8f04-0a2a-4890-aeed-aab8d7f2ec71',
        issuerId:
          'https://apphub-test-uaa-instance.predix-uaa.run.aws-usw02-dev.ice.predix.io/oauth/token',
        subdomain: 'apphub-test-uaa-instance',
        uri: 'https://apphub-test-uaa-instance.predix-uaa.run.aws-usw02-dev.ice.predix.io',
        zone: {
          'http-header-name': 'X-Identity-Zone-Id',
          'http-header-value': '45ae8f04-0a2a-4890-aeed-aab8d7f2ec71'
        }
      },
      label: 'predix-uaa',
      name: 'apphub-test-uaa-instance'
    }
  ],
  'predix-redis': [
    {
      credentials: {
        host: '127.0.0.1',
        password: 'test',
        port: 6379
      },
      label: 'predix-redis',
      name: 'jps-dev-redis'
    }
  ]
});

const mockVcapApplication = JSON.stringify({
  application_id: '383c57ce-fee8-4284-93fb-c0c7ee1063ca',
  application_name: 'apphub-microapp-seed',
  application_uris: ['apphub-microapp-seed.run.aws-usw02-dev.ice.predix.io'],
  application_version: '71679187-9420-4ee0-9c27-5959ce15f252',
  cf_api: 'https://api.system.aws-usw02-dev.ice.predix.io',
  name: 'apphub-microapp-seed',
  uris: ['apphub-microapp-seed.local.test']
});

process.env.VCAP_APPLICATION = mockVcapApplication;
process.env.VCAP_SERVICES = mockVcapServices;
process.env.UAA_SERVICE_LABEL = 'predix-uaa';

describe('Env', () => {
  it('be defined', () => {
    expect(dotenv).to.not.be.null;
  });



  if (!process.env.JENKINS_HOME && process.env.REDIS_HOST) {

    describe('VCAP_SERVICES - REDIS', () => {
      xit('should set REDIS_HOST / REDIS_PORT / REDIS_PASSWORD if in process.env.VCAP_SERVICES', () => {
        expect(process.env.REDIS_HOST).to.equal('127.0.0.1');
        expect(process.env.REDIS_PORT).to.equal('6379');
        expect(process.env.REDIS_PASSWORD);
      });
    });

    describe('VCAP_SERVICES - UAA', () => {
      it('should parse VCAP_APPLICATION and set UAA callback information', () => {
        expect(process.env).to.not.be.null;
        // expect(process.env.UAA_CALLBACK_URL).to.equal('https://apphub-microapp-seed.local.test/callback');
        expect(process.env.UAA_CALLBACK_URL).to.contain('/oauth/callback');
      });

      it('should set UAA_URL', () => {
        expect(process.env.UAA_URL).to.not.be.null;
      });
    });
  }
});
