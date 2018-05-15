const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const log = require('./logger')('env');

module.exports = () => {
  const envToSet = {};
  let envPath = process.env.NODE_ENV === 'production' ? path.resolve(__dirname, './.env') : path.resolve(__dirname, '../../../.env');
  log.debug('envPath', envPath);

  if (!fs.existsSync) {
    log.error(`Cannot find ${envPath}`);
  }

  if (process.env.USE_ENV) {
    envPath = `${process.env.USE_ENV}`;
    require('dotenv').config({ path: envPath });
  } else {
    require('dotenv').config();
  }

  log.debug('loading', envPath);

  if (process.env.NODE_ENV !== 'test') {
    // const envConfig = require('dotenv').parse(fs.readFileSync(envPath));
    // log.debug('Parsed env', envConfig);
  }

  const {
    VCAP_APPLICATION,
    VCAP_SERVICES,
    UAA_SERVICE_LABEL,
    REDIS_SERVICE_LABEL
  } = process.env;

  if (VCAP_SERVICES) {
    const vcapServices = JSON.parse(VCAP_SERVICES);

    log.debug('VCAP_SERVICES', JSON.stringify(vcapServices, null, 2));

    if (vcapServices && UAA_SERVICE_LABEL) {
      const uaaService = _.get(vcapServices[UAA_SERVICE_LABEL], '0', {});
      log.debug('setting UAA env from VCAP_SERVICES');
      envToSet.UAA_URL = uaaService.uri;
    }

    if (vcapServices && REDIS_SERVICE_LABEL) {
      const redisService = _.get(vcapServices[REDIS_SERVICE_LABEL], '0', {});
      log.debug('setting Redis env from VCAP_SERVICES', redisService);
      envToSet.REDIS_HOST = redisService.credentials.host;
      envToSet.REDIS_PORT = redisService.credentials.port;
      envToSet.REDIS_PASSWORD = redisService.credentials.password;
    }
  }

  if (VCAP_APPLICATION) {
    const vcapApplication = JSON.parse(VCAP_APPLICATION);
    envToSet.UAA_CALLBACK_URL = `https://${vcapApplication.uris[0]}/callback`;
  }

  Object.keys(envToSet).forEach((key) => {
    log.debug('set', key, envToSet[key]);
    process.env[key] = envToSet[key];
  });
};
