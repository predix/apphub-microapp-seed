const path = require('path');
const dotenv = require('dotenv');
const log = require('./logger')('env');

var envPath = process.env.NODE_ENV === 'production' ? path.resolve(__dirname, './.env') : path.resolve(__dirname, '../../../.env');
if(process.env.USE_ENV){
  envPath += `.${process.env.USE_ENV}`;
}
log.debug('loading', envPath);

if(process.env.NODE_ENV !== 'test'){
  const result = dotenv.config({
    path: envPath
  });
   
  if (result.error) {
    throw result.error;
  }
   
  log.debug( 'Parsed env', result.parsed);
}


var envToSet = {};

const { VCAP_APPLICATION, VCAP_SERVICES, UAA_SERVICE_LABEL, REDIS_SERVICE_LABEL } = process.env;

if(VCAP_SERVICES){
	var vcapServices = JSON.parse(VCAP_SERVICES);
	var uaaService = vcapServices[UAA_SERVICE_LABEL || 'predix-uaa'];
	var redisService = vcapServices[REDIS_SERVICE_LABEL || 'predix-redis'];
  if(uaaService){
    log.debug('setting UAA env from VCAP_SERVICES');
    uaaService = uaaService[0];
    envToSet.UAA_URL = uaaService.uri;
  }
  if(redisService){
    redisService = redisService[0];
    log.debug('setting Redis env from VCAP_SERVICES', redisService);
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
  log.debug('set', key, envToSet[key]);
  process.env[key] = envToSet[key];
});

module.exports = envToSet;
