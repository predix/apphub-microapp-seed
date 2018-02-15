const dotenv = require('dotenv');
dotenv.config();


var envToSet = {};

const { VCAP_APPLICATION, VCAP_SERVICES, UAA_SERVICE_LABEL, REDIS_SERVICE_LABEL } = process.env;

if(VCAP_SERVICES){
	var vcapServices = JSON.parse(VCAP_SERVICES);
	var uaaService = vcapServices[UAA_SERVICE_LABEL || 'predix-uaa'];
	var redisService = vcapServices[REDIS_SERVICE_LABEL || 'predix-redis'];
  if(uaaService){
    console.log('setting UAA env from VCAP_SERVICES');
    uaaService = uaaService[0];
    envToSet.UAA_URL = uaaService.uri;
  }
  if(redisService){
    redisService = redisService[0];
    console.log('setting Redis env from VCAP_SERVICES', redisService);
    envToSet.REDIS_HOST = redisService.credentials.host;
    envToSet.REDIS_PORT = redisService.credentials.port;
    envToSet.REDIS_PASSWORD = redisService.credentials.password;
  }
}

if(VCAP_APPLICATION){
  var vcapApplication = JSON.parse(VCAP_APPLICATION);
  envToSet.UAA_CALLBACK_URL = `https://${vcapApplication.uris[0]}/callback`;
}

Object.keys(envToSet).forEach((key, index) => {
  console.log('setting =>', key);
  process.env[key] = envToSet[key];
});

module.exports = envToSet;
