const dotenv = require('dotenv');
dotenv.config();




const {VCAP_SERVICES} = process.env;
if(VCAP_SERVICES){
  console.log('Parse vcap services');

  if(VCAP_SERVICES['predix-uaa']){
    const UAA_SERVICE = VCAP_SERVICES['predix-uaa'][0].credentials;
    process.env.UAA_URL = UAA_SERVICE.uri;
  }
}

/**
{
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
  ]
 }
*/
