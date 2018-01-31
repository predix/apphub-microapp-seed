const dotenv = require('dotenv');
dotenv.config();


var envToSet = {};

const { VCAP_APPLICATION, VCAP_SERVICES, UAA_SERVICE_LABEL } = process.env;

if(VCAP_SERVICES){
	var vcapServices = JSON.parse(VCAP_SERVICES);
	var uaaService = vcapServices[UAA_SERVICE_LABEL];
  if(uaaService){
    uaaService = uaaService[0];
    envToSet.UAA_URL = uaaService.uri;
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
