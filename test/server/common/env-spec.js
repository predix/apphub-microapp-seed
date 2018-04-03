'use strict';
require('dotenv').config();
const expect = require('chai').expect;
const helpers = require('../../helpers');
const requireHelper = helpers.require;

process.env.UAA_SERVICE_LABEL = 'predix-uaa';
process.env.REDIS_SERVICE_LABEL = 'predix-redis';
const mockVcapServices = JSON.stringify({
  "predix-uaa": [
    {
      "credentials": {
        "dashboardUrl": "https://uaa-dashboard.run.aws-usw02-dev.ice.predix.io/#/login/45ae8f04-0a2a-4890-aeed-aab8d7f2ec71",
        "issuerId": "https://apphub-test-uaa-instance.predix-uaa.run.aws-usw02-dev.ice.predix.io/oauth/token",
        "subdomain": "apphub-test-uaa-instance",
        "uri": "https://apphub-test-uaa-instance.predix-uaa.run.aws-usw02-dev.ice.predix.io",
        "zone": {
          "http-header-name": "X-Identity-Zone-Id",
          "http-header-value": "45ae8f04-0a2a-4890-aeed-aab8d7f2ec71"
        }
      },
      "label": "predix-uaa",
      "name": "apphub-test-uaa-instance",
      "plan": "Free",
      "provider": null,
      "syslog_drain_url": null,
      "tags": [],
      "volume_mounts": []
    }
  ],
  "predix-redis": [
    {
      "credentials": {
        "host": "localhost",
        "password": "test",
        "port": 6379
      },
      "label": "predix-redis",
      "name": "jps-dev-redis",
      "plan": "Free",
      "provider": null,
      "syslog_drain_url": null,
      "tags": [
        "redis"
      ],
      "volume_mounts": []
    }
  ]
});

const mockVcapApplication = JSON.stringify({
  "application_id": "383c57ce-fee8-4284-93fb-c0c7ee1063ca",
  "application_name": "apphub-microapp-seed",
  "application_uris": ["apphub-microapp-seed.run.aws-usw02-dev.ice.predix.io"],
  "application_version": "71679187-9420-4ee0-9c27-5959ce15f252",
  "cf_api": "https://api.system.aws-usw02-dev.ice.predix.io",
  "limits": {
    "disk": 1024,
    "fds": 16384,
    "mem": 1024
  },
  "name": "apphub-microapp-seed",
  "uris": ["apphub-microapp-seed.local.test"]
});

process.env.VCAP_APPLICATION = mockVcapApplication;
process.env.VCAP_SERVICES = mockVcapServices;

describe('Env', () => {
  const dotenv = requireHelper('server/common/env');
  const {env} = process;

  it('be defined', () => {
    expect(dotenv).to.not.be.null;
  });

  describe('VCAP_SERVICES - REDIS', () => {
    it('should set REDIS_HOST / REDIS_PORT / REDIS_PASSWORD if in VCAP', () => {
      expect(env.REDIS_HOST).to.equal('localhost');
      expect(env.REDIS_PORT).to.equal('6379');
      expect(env.REDIS_PASSWORD);
    });
  });

  describe('VCAP_SERVICES - UAA', () => {
    it('should parse VCAP_APPLICATION and set UAA callback information', () => {
      expect(env).to.not.be.null;
      expect(process.env.UAA_CALLBACK_URL).to.equal('https://apphub-microapp-seed.local.test/callback');
      //expect(env.UAA_CALLBACK_URL).to.equal('http://localhost:9000/oauth/callback');
    });

    it('should set UAA_URL', () => {
      expect(process.env.UAA_URL).to.not.be.null;
    });
  });




});
